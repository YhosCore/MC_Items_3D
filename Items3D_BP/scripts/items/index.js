import { registerEspadaV01 } from "./weapons/espadaV01.js";
import { registerEscudoV01 } from "./shields/escudoV01.js";

const ITEM_MODULES = [
  registerEspadaV01,
  registerEscudoV01
];

export function registerItemSystems(world) {
  for (const registerModule of ITEM_MODULES) {
    registerModule(world);
  }
}
