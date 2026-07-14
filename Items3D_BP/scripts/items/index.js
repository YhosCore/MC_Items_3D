import { registerEspadaV01 } from "./weapons/espadaV01.js";

const ITEM_MODULES = [
  registerEspadaV01
];

export function registerItemSystems(world) {
  for (const registerModule of ITEM_MODULES) {
    registerModule(world);
  }
}
