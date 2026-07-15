import { system } from "@minecraft/server";
import { ITEM_IDS, SHIELD_ATTRIBUTES } from "../../utils/constants.js";

const CONFIG = SHIELD_ATTRIBUTES.ESCUDO_V01;
const RECENT_DAMAGE_TICKS = 2;
const recentDamageByPlayer = new Map();

export function registerEscudoV01(world) {
  registerManualDurabilityComponent(world);
  registerProjectileBlocking(world);
  world.afterEvents.entityHurt.subscribe(handleEntityHurt);
  world.afterEvents.entityHitEntity.subscribe(handleEntityHitEntity);
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

function registerProjectileBlocking(world) {
  system.runInterval(() => {
    for (const player of world.getPlayers()) {
      if (!isBlocking(player)) {
        continue;
      }

      const equipped = getEquippedShield(player);
      if (!equipped.item) {
        continue;
      }

      const center = { x: player.location.x, y: player.location.y + 0.5, z: player.location.z };
      const view = player.getViewDirection();

      for (const entity of player.dimension.getEntities()) {
        if (!entity.hasComponent?.("minecraft:projectile")) {
          continue;
        }

        if (getDistance3D(center, entity.location) >= 2) {
          continue;
        }

        damageEquippedShield(player, equipped.hand, equipped.item);
        playShieldSound(player, CONFIG.blockSound);

        try {
          entity.applyImpulse({ x: view.x * 1.5, y: view.y * 1.5, z: view.z * 1.5 });
        } catch {
          // Some projectiles cannot be pushed before removal.
        }

        try {
          entity.remove();
        } catch {
          // Projectile may already be gone.
        }
      }
    }
  }, 0);
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

  if (!isPlayer(player) || !attacker || !isBlocking(player) || !isFacingAttacker(player, attacker)) {
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
    knockBackAttacker(player, attacker);
  });
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

function knockBackAttacker(player, attacker) {
  try {
    const dx = attacker.location.x - player.location.x;
    const dz = attacker.location.z - player.location.z;
    attacker.applyKnockback(dx, dz, 1.3, 0.52);
  } catch {
    // Knockback is a bonus; blocking should still work.
  }
}

function isFacingAttacker(player, attacker) {
  try {
    const dy = player.getRotation().y - attacker.getRotation().y;
    return Math.abs(dy) > 90;
  } catch {
    return isInFront(player, attacker.location);
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

function getDistance3D(a, b) {
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
