export function getSelectedItem(player) {
  const inventory = player.getComponent("minecraft:inventory")?.container;
  const selectedSlot = player.selectedSlotIndex ?? 0;

  if (!inventory || selectedSlot < 0) {
    return undefined;
  }

  return inventory.getItem(selectedSlot);
}
