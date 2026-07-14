import { isOnCooldown } from "../core/cooldowns.js";
import { ARCANE_SWORD_ATTRIBUTES, ITEM_IDS } from "../utils/constants.js";
import { getSelectedItem } from "../utils/inventory.js";

export function handleArcaneSwordUse(event) {
  const player = event.source;
  const item = event.itemStack;

  if (!player || player.typeId !== "minecraft:player" || item?.typeId !== ITEM_IDS.ARCANE_SWORD) {
    return;
  }

  if (isOnCooldown(player, "arcane_sword_slash", ARCANE_SWORD_ATTRIBUTES.slashCooldownTicks)) {
    return;
  }

  spawnArcaneParticles(player);
}

export function handleArcaneSwordHit(event) {
  const player = event.damagingEntity;
  const target = event.hitEntity;

  if (!player || player.typeId !== "minecraft:player" || !target) {
    return;
  }

  const heldItem = getSelectedItem(player);
  if (heldItem?.typeId !== ITEM_IDS.ARCANE_SWORD) {
    return;
  }

  applyBonusDamage(player, target);
  pushTargetAway(player, target);
  spawnArcaneParticles(target);
}

function applyBonusDamage(player, target) {
  try {
    target.applyDamage(ARCANE_SWORD_ATTRIBUTES.bonusDamage, {
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
      ARCANE_SWORD_ATTRIBUTES.knockbackStrength,
      0.12
    );
  } catch {
    // Knockback is a bonus behavior; attacks still work without it.
  }
}

function spawnArcaneParticles(entity) {
  try {
    entity.dimension.spawnParticle(ARCANE_SWORD_ATTRIBUTES.particleId, {
      x: entity.location.x,
      y: entity.location.y + 1,
      z: entity.location.z
    });
  } catch {
    // Particles are visual-only.
  }
}
