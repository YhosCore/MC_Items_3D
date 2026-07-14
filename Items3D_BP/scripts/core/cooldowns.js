import { system } from "@minecraft/server";

const cooldowns = new Map();

export function isOnCooldown(player, key, durationTicks) {
  const cooldownKey = `${player.id}:${key}`;
  const now = system.currentTick;
  const previous = cooldowns.get(cooldownKey) ?? -9999;

  if (now - previous < durationTicks) {
    return true;
  }

  cooldowns.set(cooldownKey, now);
  return false;
}
