export const ITEM_IDS = {
  ESPADA_V01: "items3d:espada_v01",
  ESCUDO_V01: "items3d:escudo_v01"
};

export const WEAPON_ATTRIBUTES = {
  ESPADA_V01: {
    bonusDamage: 2,
    knockbackStrength: 0.35,
    knockbackVertical: 0.12,
    slashCooldownTicks: 12,
    cooldownKey: "espada_v01_slash",
    particleId: "minecraft:enchanting_table_particle"
  }
};

export const SHIELD_ATTRIBUTES = {
  ESCUDO_V01: {
    durabilityDamage: 1,
    blockSound: "item.shield.block",
    breakSound: "random.break",
    particleId: "minecraft:basic_crit_particle",
    projectileBlockRadius: 2,
    attackerKnockbackStrength: 1.25,
    attackerKnockbackVertical: 0.45
  }
};
