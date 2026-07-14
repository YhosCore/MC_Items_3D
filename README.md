# MC_Items_3D

Addon base para Minecraft Bedrock enfocado en items 3D. Incluye una espada 3D exportada desde Blockbench llamada **Espada v01**.

Version actual: 1.0.5. Los archivos `.mcaddon` se exportan con version en el nombre y los packs muestran la version en Minecraft.

## Estructura

```text
Items3D_BP/
  manifest.json
  items/
  scripts/

Items3D_RP/
  manifest.json
  attachables/
  animations/
  animation_controllers/
  models/
  render_controllers/
  textures/
  texts/
```

## Item inicial

### Espada Arcana

- Identificador: `items3d:espada_arcana`
- Tipo: espada custom con item 3D/attachable.
- Daño base: `7`
- Daño extra por script: `2`
- Durabilidad: `640`
- Reparacion: fragmento de amatista.
- Encantabilidad: tipo espada.
- Efecto visual: particulas arcanas al usar o golpear.
- Animacion: `slash` al usar el item como prueba visual.

Comando de prueba:

```mcfunction
/give @s items3d:espada_arcana
```

## Atributos que podemos ajustar

En `Items3D_BP/items/espada_arcana.json`:

- `minecraft:damage`: dano base del arma.
- `minecraft:durability.max_durability`: durabilidad maxima.
- `minecraft:enchantable.value`: calidad de encantamiento.
- `minecraft:repairable.repair_items`: materiales que reparan la espada.
- `minecraft:cooldown.duration`: tiempo de espera para uso.
- `minecraft:use_modifiers.use_duration`: duracion de la accion de uso.

En `Items3D_BP/scripts/utils/constants.js`:

- `bonusDamage`: dano extra aplicado por script.
- `knockbackStrength`: empuje extra al golpear.
- `slashCooldownTicks`: cooldown del efecto de slash.
- `particleId`: particula que aparece al usar/golpear.

En `Items3D_RP/animations/espada_arcana.animation.json`:

- Rotaciones del hueso `root`.
- Duracion de la animacion.
- Forma del movimiento de ataque.

## Como probar

1. Importa `Addon_Items_3D_v1.0.5.mcaddon`.
2. Activa `Items 3D BP v1.0.5` y `Items 3D RP v1.0.5`.
3. Activa Beta APIs/Script APIs si tu version de Minecraft lo solicita.
4. Usa:

```mcfunction
/give @s items3d:espada_v01
```

## Recomendacion para modelado

Para mejorar el modelo 3D, usa Blockbench:

1. Crea un modelo Bedrock.
2. Exporta la geometria como `.geo.json`.
3. Reemplaza `Items3D_RP/models/entity/espada_arcana.geo.json`.
4. Exporta la textura a `Items3D_RP/textures/entity/espada_arcana_3d.png`.
5. Ajusta animaciones en `Items3D_RP/animations/espada_arcana.animation.json`.
