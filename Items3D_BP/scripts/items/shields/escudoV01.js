import { system } from "@minecraft/server";
import { ITEM_IDS, SHIELD_ATTRIBUTES } from "../../utils/constants.js";

const CONFIG = SHIELD_ATTRIBUTES.ESCUDO_V01;
const RECENT_DAMAGE_TICKS = 2;
const recentDamageByPlayer = new Map();
let runtimeWorld;

export function registerEscudoV01(world) {
  runtimeWorld = world;
  registerManualDurabilityComponent(world);
  world.afterEvents.entityHurt.subscribe(handleEntityHurt);
  world.afterEvents.entityHitEntity.subscribe(handleEntityHitEntity);
  system.runInterval(handleProjectiles, 0);
}

function registerManualDurabilityComponent(world) {
  try {
    world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
      itemComponentRegistry.registerCustomComponent("items3d:manual_shield_durability", {
        onBeforeDurabilityDamage: (event) => {
          event.durabilityDamage = 0;
        }
      });
    });
  } catch {
    // Older runtimes may not expose item component registration.
  }
}

function handleEntityHurt(event) {
  const player = event.hurtEntity;

  if (!isPlayer(player)) {
    return;
  }

  recentDamageByPlayer.set(getPlayerKey(player), event.damage ?? 0);
  system.runTimeout(() => recentDamageByPlayer.delete(getPlayerKey(player)), RECENT_DAMAGE_TICKS);
}

function handleEntityHitEntity(event) {
  const player = event.hitEntity;
  const attacker = event.damagingEntity;

  if (!isPlayer(player) || !attacker || !isBlocking(player) || !isInFront(player, attacker.location)) {
    return;
  }

  const equipped = getEquippedShield(player);
  if (!equipped.item) {
    return;
  }

  system.runTimeout(() => {
    restoreBlockedDamage(player);
    damageEquippedShield(player, equipped.hand, equipped.item);
    playShieldSound(player, CONFIG.blockSound);
    spawnBlockParticle(player);
  });

  knockbackAttacker(player, attacker);
  keepPlayerRotationStable(player);
}

function handleProjectiles() {
  if (!runtimeWorld) {
    return;
  }

  for (const player of runtimeWorld.getPlayers()) {
    if (!isBlocking(player)) {
      continue;
    }

    const equipped = getEquippedShield(player);
    if (!equipped.item) {
      continue;
    }

    for (const entity of player.dimension.getEntities()) {
      if (!entity.hasComponent?.("minecraft:projectile")) {
        continue;
      }

      if (getDistance(getShieldCenter(player), entity.location) > CONFIG.projectileBlockRadius) {
        continue;
      }

      if (!isInFront(player, entity.location)) {
        continue;
      }

      damageEquippedShield(player, equipped.hand, equipped.item);
      playShieldSound(player, CONFIG.blockSound);
      spawnBlockParticle(player);
      deflectAndRemoveProjectile(player, entity);
    }
  }
}

function getEquippedShield(player) {
  const equippable = player.getComponent("minecraft:equippable");
  const mainHand = equippable?.getEquipmentSlot("Mainhand")?.getItem();
  const offHand = equippable?.getEquipmentSlot("Offhand")?.getItem();

  if (mainHand?.typeId === ITEM_IDS.ESCUDO_V01 && offHand?.typeId !== ITEM_IDS.ESCUDO_V01) {
    return { hand: "Mainhand", item: mainHand };
  }

  if (offHand?.typeId === ITEM_IDS.ESCUDO_V01 && mainHand?.typeId !== ITEM_IDS.ESCUDO_V01) {
    return { hand: "Offhand", item: offHand };
  }

  return { hand: undefined, item: undefined };
}

function isBlocking(player) {
  // Custom shield blocking follows the Bedrock custom shield pattern:
  // crouch starts the defensive state, while the item tag enables shield visuals.
  return Boolean(player.isSneaking);
}

function restoreBlockedDamage(player) {
  const blockedDamage = recentDamageByPlayer.get(getPlayerKey(player)) ?? 0;
  if (blockedDamage <= 0) {
    return;
  }

  const health = player.getComponent("minecraft:health");
  if (!health) {
    return;
  }

  const maxHealth = health.effectiveMaxValue ?? health.defaultValue ?? 20;
  health.setCurrentValue(Math.min(health.currentValue + blockedDamage, maxHealth));

  try {
    player.extinguishFire();
  } catch {
    // Extinguishing is a small vanilla-shield-like bonus.
  }
}

function damageEquippedShield(player, hand, item) {
  if (!hand || !item || isCreative(player)) {
    return;
  }

  const nextItem = damageItem(item, CONFIG.durabilityDamage);
  const equippable = player.getComponent("minecraft:equippable");

  try {
    equippable?.setEquipment(hand, nextItem);
    if (!nextItem) {
      playShieldSound(player, CONFIG.breakSound);
    }
  } catch {
    // If the runtime rejects replacing equipment, blocking still prevents damage.
  }
}

function damageItem(item, amount) {
  const durability = item.getComponent("durability") ?? item.getComponent("minecraft:durability");
  if (!durability) {
    return item;
  }

  if (durability.damage + amount >= durability.maxDurability) {
    return undefined;
  }

  durability.damage += amount;
  return item;
}

function knockbackAttacker(player, attacker) {
  try {
    const dx = attacker.location.x - player.location.x;
    const dz = attacker.location.z - player.location.z;
    const length = Math.max(Math.hypot(dx, dz), 0.001);

    attacker.applyKnockback(
      dx / length,
      dz / length,
      CONFIG.attackerKnockbackStrength,
      CONFIG.attackerKnockbackVertical
    );
  } catch {
    // Some entities cannot receive knockback.
  }
}

function deflectAndRemoveProjectile(player, projectile) {
  try {
    const view = player.getViewDirection();
    projectile.applyImpulse({
      x: view.x * 1.5,
      y: view.y * 1.5,
      z: view.z * 1.5
    });
  } catch {
    // Projectile removal is the important defensive behavior.
  }

  try {
    projectile.remove();
  } catch {
    // Projectile may already be gone.
  }
}

function spawnBlockParticle(player) {
  try {
    player.dimension.spawnParticle(CONFIG.particleId, getShieldCenter(player));
  } catch {
    // Visual-only.
  }
}

function playShieldSound(player, sound) {
  try {
    player.dimension.playSound(sound, player.location);
    return;
  } catch {
    // Fall back to command playback below.
  }

  try {
    player.runCommandAsync(`playsound ${sound} @s`);
  } catch {
    // Sound is non-critical.
  }
}

function keepPlayerRotationStable(player) {
  try {
    player.teleport(player.location, { rotation: player.getRotation() });
  } catch {
    // Rotation lock is a polish detail.
  }
}

function isInFront(player, targetLocation) {
  const view = player.getViewDirection();
  const dx = targetLocation.x - player.location.x;
  const dz = targetLocation.z - player.location.z;
  const length = Math.max(Math.hypot(dx, dz), 0.001);
  const dot = view.x * (dx / length) + view.z * (dz / length);

  return dot > 0.15;
}

function getShieldCenter(player) {
  const view = player.getViewDirection();
  return {
    x: player.location.x + view.x * 0.55,
    y: player.location.y + 1 + view.y * 0.25,
    z: player.location.z + view.z * 0.55
  };
}

function getDistance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
}

function getPlayerKey(player) {
  return player.id ?? player.nameTag;
}

function isCreative(player) {
  try {
    return player.getGameMode() === "creative";
  } catch {
    return false;
  }
}

function isPlayer(entity) {
  return entity?.typeId === "minecraft:player";
}
