# Configuracion inicial

## Proyecto

- Carpeta local: `C:\Users\manue\Escritorio\Minecraft_Proyectos\Addon_Items_3D`
- Repositorio remoto: `https://github.com/YhosCore/MC_Items_3D`
- Rama de trabajo Codex: `Codex_MC_items`
- Namespace: `items3d`

## Reglas aprendidas

- Mantener BP y RP separados.
- Mostrar version en `header.name`, `header.description` y `header.version`.
- Exportar solo el `.mcaddon` mas reciente.
- Mantener icono de inventario y textura 3D en rutas separadas.
- Usar el `.geo.json` para geometria, no como textura.
- Guardar animaciones de primera y tercera persona en `animations/attachables/`.
- Validar JSON y scripts antes de empaquetar.
- Empaquetar `.mcaddon` con rutas internas `/`, estilo Blockbench.

## Espada v01

- Item: `items3d:espada_v01`
- Modelo 3D: `Items3D_RP/models/entity/espada_v01.geo.json`
- Textura en mano: `Items3D_RP/textures/entity/attachable/espada_v01.png`
- Icono: `Items3D_RP/textures/items/espada_v01.png`
- Attachable: `Items3D_RP/attachables/espada_v01.json`
- Animaciones: `Items3D_RP/animations/attachables/espada_v01.animation.json`
- Script: `Items3D_BP/scripts/items/weapons/espadaV01.js`
- Registro de scripts: `Items3D_BP/scripts/items/index.js`

## Escudo v01

- Item: `items3d:escudo_v01`
- Modelo 3D: `Items3D_RP/models/entity/escudo_v01.geo.json`
- Textura en mano: `Items3D_RP/textures/entity/attachable/escudo_v01.png`
- Icono: `Items3D_RP/textures/items/escudo_v01.png`
- Attachable: `Items3D_RP/attachables/escudo_v01.json`
- Animaciones: `Items3D_RP/animations/attachables/escudo_v01.animation.json`
- Offhand: `minecraft:allow_off_hand`

## Atributos planeados

- Dano base.
- Dano extra por script.
- Durabilidad.
- Reparacion.
- Encantabilidad.
- Knockback.
- Cooldown.
- Particulas.
- Sonidos.
- Animaciones de uso/ataque.

## Validacion

```powershell
Get-ChildItem -Path . -Recurse -Filter *.json | ForEach-Object {
  Get-Content -Raw -LiteralPath $_.FullName | ConvertFrom-Json | Out-Null
}

Get-ChildItem -Path Items3D_BP\scripts -Recurse -Filter *.js | ForEach-Object {
  node --check $_.FullName
}
```
