import { isOnCooldown } from "../../core/cooldowns.js";
import { ITEM_IDS, WEAPON_ATTRIBUTES } from "../../utils/constants.js";
import { getSelectedItem } from "../../utils/inventory.js";

const CONFIG = WEAPON_ATTRIBUTES.ESPADA_V01;

export function registerEspadaV01(world) {
  world.afterEvents.itemUse.subscribe(handleUse);
  world.afterEvents.entityHitEntity.subscribe(handleHit);
}

function handleUse(event) {
  const player = event.source;
  const item = event.itemStack;

  if (!player || player.typeId !== "minecraft:player" || item?.typeId !== ITEM_IDS.ESPADA_V01) {
    return;
  }

  if (isOnCooldown(player, CONFIG.cooldownKey, CONFIG.slashCooldownTicks)) {
    return;
  }

  spawnWeaponParticles(player);
}

function handleHit(event) {
  const player = event.damagingEntity;
  const target = event.hitEntity;

  if (!player || player.typeId !== "minecraft:player" || !target) {
    return;
  }

  const heldItem = getSelectedItem(player);
  if (heldItem?.typeId !== ITEM_IDS.ESPADA_V01) {
    return;
  }

  applyBonusDamage(player, target);
  pushTargetAway(player, target);
  spawnWeaponParticles(target);
}

function applyBonusDamage(player, target) {
  try {
    target.applyDamage(CONFIG.bonusDamage, {
      cause: "entityAttack",
      damagingEntity: player
    });
  } catch {
    // Some entities or runtime versions may reject scripted damage.
  }
}

function pushTargetAway(player, target) {
  try {
    const dx = target.location.x - player.location.x;
    const dz = target.location.z - player.location.z;
    const length = Math.max(Math.hypot(dx, dz), 0.001);

    target.applyKnockback(
      dx / length,
      dz / length,
      CONFIG.knockbackStrength,
      CONFIG.knockbackVertical
    );
  } catch {
    // Knockback is a bonus behavior; attacks still work without it.
  }
}

function spawnWeaponParticles(entity) {
  try {
    entity.dimension.spawnParticle(CONFIG.particleId, {
      x: entity.location.x,
      y: entity.location.y + 1,
      z: entity.location.z
    });
  } catch {
    // Particles are visual-only.
  }
}
