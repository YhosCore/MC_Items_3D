# MC_Items_3D

Addon base para Minecraft Bedrock enfocado en items 3D. Incluye una espada 3D exportada desde Blockbench y un escudo 3D base.

Version actual: 1.2.1. Los archivos `.mcaddon` se exportan con version en el nombre y los packs muestran la version en Minecraft.

## Estructura

```text
Items3D_BP/
  manifest.json
  items/
    escudo_v01.json
    espada_v01.json
  scripts/
    main.js
    core/
      cooldowns.js
    items/
      index.js
      weapons/
        espadaV01.js
    utils/
      constants.js
      inventory.js

Items3D_RP/
  manifest.json
  attachables/
    escudo_v01.json
    espada_v01.json
  animations/
    attachables/
      escudo_v01.animation.json
      espada_v01.animation.json
  models/
    entity/
      escudo_v01.geo.json
      espada_v01.geo.json
  textures/
    item_texture.json
    items/
      escudo_v01.png
      espada_v01.png
    entity/
      attachable/
        escudo_v01.png
        espada_v01.png
  texts/
    es_MX.lang
    en_US.lang
```

## Espada v01

- Identificador: `items3d:espada_v01`
- Tipo: espada custom con item 3D/attachable.
- Dano base: `7`
- Dano extra por script: `2`
- Durabilidad: `251`
- Reparacion: lingote de hierro.
- Encantabilidad: tipo espada.
- Efecto visual: particulas al usar o golpear.
- Animacion: posicion personalizada de primera y tercera persona.

Comando de prueba:

```mcfunction
/give @s items3d:espada_v01
```

## Escudo v01

- Identificador: `items3d:escudo_v01`
- Tipo: escudo custom 3D/attachable.
- Durabilidad: `336`
- Reparacion: madera y lingote de hierro.
- Offhand: preparado con `minecraft:allow_off_hand`.
- Animacion: posicion personalizada de primera y tercera persona.

Comando de prueba:

```mcfunction
/give @s items3d:escudo_v01
```

## Archivos clave

- `Items3D_BP/items/espada_v01.json`: define dano, durabilidad, reparacion, encantabilidad e icono.
- `Items3D_BP/scripts/items/weapons/espadaV01.js`: define efectos por script al usar/golpear.
- `Items3D_BP/scripts/items/index.js`: registra todos los modulos de items.
- `Items3D_RP/attachables/espada_v01.json`: conecta item, modelo, textura y animaciones.
- `Items3D_RP/models/entity/espada_v01.geo.json`: define la geometria del modelo 3D.
- `Items3D_RP/textures/entity/attachable/espada_v01.png`: textura del modelo en mano.
- `Items3D_RP/textures/items/espada_v01.png`: icono del inventario.
- `Items3D_RP/animations/attachables/espada_v01.animation.json`: primera y tercera persona.

## Como probar

1. Importa `Addon_Items_3D_v1.2.1.mcaddon`.
2. Activa `Items 3D BP v1.2.1` y `Items 3D RP v1.2.1`.
3. Activa Beta APIs/Script APIs si tu version de Minecraft lo solicita.
4. Usa:

```mcfunction
/give @s items3d:espada_v01
/give @s items3d:escudo_v01
```

## Para crecer

Lee:

```text
docs/ESTRUCTURA.md
docs/NUEVO_ITEM.md
```

La regla principal: cada nuevo item debe tener nombre base consistente en BP, RP, texturas, modelo, animaciones y script.

## Empaquetar

```powershell
.\tools\package-addon.ps1 -Version 1.2.1
```
