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
- Crear estructura modular desde el inicio.
- Validar JSON y scripts antes de empaquetar.
- Documentar comandos de prueba y atributos ajustables.

## Versionado

Ejemplo:

```json
{
  "name": "Items 3D BP v1.0.0",
  "description": "Version 1.0.0 - Paquete de comportamiento para items 3D.",
  "version": [1, 0, 0]
}
```

## Espada Arcana

- Item: `items3d:espada_arcana`
- Modelo 3D: `Items3D_RP/models/entity/espada_arcana.geo.json`
- Attachable: `Items3D_RP/attachables/espada_arcana.json`
- Animaciones: `Items3D_RP/animations/espada_arcana.animation.json`
- Script: `Items3D_BP/scripts/items/arcaneSword.js`

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
