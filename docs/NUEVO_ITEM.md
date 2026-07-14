# Guia rapida para agregar un item 3D

1. Exporta desde Blockbench:

```text
modelo .geo.json
textura del modelo 32x32 o 64x64
animacion primera persona
animacion tercera persona
```

2. Copia los archivos al RP:

```text
models/entity/nombre_item.geo.json
textures/entity/attachable/nombre_item.png
animations/attachables/nombre_item.animation.json
attachables/nombre_item.json
textures/items/nombre_item.png
```

3. Crea el item en BP:

```text
items/nombre_item.json
```

4. Si tiene poder especial, crea script:

```text
scripts/items/weapons/nombreItem.js
```

5. Registra el script en:

```text
scripts/items/index.js
```

6. Agrega nombre visible:

```text
texts/es_MX.lang
texts/en_US.lang
```

7. Agrega el icono al atlas:

```text
textures/item_texture.json
```

8. Valida y empaqueta.
