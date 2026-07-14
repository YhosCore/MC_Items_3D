# Estructura para crecer el addon

Este addon mantiene las carpetas que Minecraft Bedrock espera, pero organiza nombres y scripts para que sea facil agregar mas items, animaciones, sonidos y efectos.

## Paquete de comportamiento

```text
Items3D_BP/
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
```

Reglas:

- Cada item jugable tiene un JSON en `Items3D_BP/items/`.
- Cada comportamiento con script vive en `Items3D_BP/scripts/items/`.
- Los items de arma van en `scripts/items/weapons/`.
- `scripts/items/index.js` registra todos los modulos de items.
- `scripts/main.js` solo arranca sistemas, no debe llenarse de logica.

## Paquete de recursos

```text
Items3D_RP/
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

Reglas:

- `textures/items/` es para iconos del inventario.
- `textures/entity/attachable/` es para texturas del modelo en mano.
- `models/entity/` guarda modelos `.geo.json`.
- `animations/attachables/` guarda posiciones de primera y tercera persona.
- `attachables/` conecta item, modelo, textura y animaciones.

## Convencion para nuevos items

Si creas `items3d:espada_fuego`, usa este mismo nombre base:

```text
Items3D_BP/items/espada_fuego.json
Items3D_RP/attachables/espada_fuego.json
Items3D_RP/models/entity/espada_fuego.geo.json
Items3D_RP/animations/attachables/espada_fuego.animation.json
Items3D_RP/textures/items/espada_fuego.png
Items3D_RP/textures/entity/attachable/espada_fuego.png
Items3D_BP/scripts/items/weapons/espadaFuego.js
```

Luego registra el script en:

```text
Items3D_BP/scripts/items/index.js
```

## Sonidos

Cuando agreguemos sonidos, usar esta estructura:

```text
Items3D_RP/sounds/
  weapons/
    espada_fuego/
      slash.ogg
      impact.ogg
  sound_definitions.json
```

Desde script se reproduciran con:

```js
player.dimension.playSound("items3d.espada_fuego.slash", player.location);
```

## Versionado

Cada export debe subir version:

```text
Addon_Items_3D_v1.2.0.mcaddon
Items 3D BP v1.2.0
Items 3D RP v1.2.0
```

Para empaquetar:

```powershell
.\tools\package-addon.ps1 -Version 1.2.0
```
