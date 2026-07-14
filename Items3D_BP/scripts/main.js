import { world } from "@minecraft/server";
import { handleArcaneSwordHit, handleArcaneSwordUse } from "./items/arcaneSword.js";

world.afterEvents.itemUse.subscribe(handleArcaneSwordUse);
world.afterEvents.entityHitEntity.subscribe(handleArcaneSwordHit);
