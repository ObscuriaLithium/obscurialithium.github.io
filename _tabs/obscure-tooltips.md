---
title: Obscure Tooltips
date: 2025-09-25 12:00:00 -0300
last_modified_at: 2025-12-02 16:00:00 -0300
layout: post
icon_url: /assets/img/tabs/obscure-tooltips.png
icon: fas fa-book
order: 2
toc: true
comments: true
image:
  path: /assets/images/obscure-tooltips-logo.jpg
---

**Obscure Tooltips** is a client-side mod that enhances item tooltips with animated visual and particle effects, making rarer items more vibrant and eye-catching. The information provided here is intended to help understand the core concepts of the mod and customize it to your needs.

> This wiki is relevant only for **version 3.0.0 and above**.<br>Older versions are incomplete and may be unstable.
{: .prompt-info }





![separator](/assets/img/separator.png)





## Key Concept

Obscure Tooltips works like a box of LEGO. Every tooltip is made from small pieces. You can mix existing pieces or create your own. All customization is done either through a **custom resource pack**, or in a **config-like way** using [Fragmentum Layer](/fragmentum-layer/) – no compiling, no manual enabling, nothing complicated.

### How Everything Works

- There are basic visual pieces: [Panels](#available-panels), [Frames](#available-frames), [Slots](#available-slots), [Icons](#available-icons), and [Effects](#available-effects). These are simply visual JSON definitions. They don't know when or where they'll be used – only what they look like.

- These pieces are combined into [Styles](#about-styles). A Style is a JSON file that says: "use this panel, this frame, these effects." Styles contain no logic – only appearance.

- To actually apply a Style to items, you use [Definitions](#about-definitions). A Definition is a JSON file with a priority, a link to a Style, and filters: by item ID, tags, rarity, NBT, and so on.

### Pack Structure

The folder layout below shows how Obscure Tooltips organizes all its data. This structure is the same whether you are using a **resource pack** or the **root directory of Fragmentum Layer** – the mod reads both in exactly the same format.

```text
assets/
└── <mod_id>/              -> your pack's namespace
    └── tooltips/
        ├── element/       -> element repository
        │   ├── panel/
        │   ├── frame/
        │   ├── slot/
        │   ├── icon/
        │   └── effect/
        ├── style/         -> style repository
        ├── definition/    -> definition repository
        └── label/         -> label repository
```





![separator](/assets/img/separator.png)





## Make Your First Style

To see a full production-ready example of many features (particles, animated accents, textured frames), check the built-in [Vibrant Tooltips](https://github.com/ObscuriaLithium/obscure-tooltips/tree/master/common/src/main/resources/packs/vibrant_tooltips) resource pack in the project repository. 

If you want to work on a clean canvas without fighting against predefined styles, simply **disable Vibrant Tooltips** before following the steps below.

Below – a minimal 5-step guide to create a custom style that will apply only to uncommon items using the Fragmentum Layer (config folder). This example:
- creates a small custom panel (light green tint),
- creates a style that uses that panel, and
- creates a definition that applies the style to uncommon rarity items.

### Quick Summary (what you'll create)

1. `tooltips/element/panel/uncommon_panel.json` – custom panel (color)
2. `tooltips/style/uncommon_style.json` – style that references the panel
3. `tooltips/definition/uncommon_definition.json` – rule: apply to uncommon items

### Where to Put Files

Create these files under your Minecraft user folder. Example path:

```text
.minecraft/config/fragmentum/assets/my_tooltips/
└── tooltips/
    ├── element/panel/
    │   └── uncommon_panel.json
    ├── style/
    │   └── uncommon_style.json
    └── definition/
        └── uncommon_definition.json
```

> If you use a different namespace instead of `my_tooltips`, keep paths consistent and use the same namespace in style and definition JSONs.
{: .prompt-tip }

-----

### 1. Create a Custom Panel

`tooltips/element/panel/uncommon_panel.json`:

```json
{
  "type": "obscure_tooltips:color_rect",
  "background_palette": {
    "top_left": "#20a8a800",
    "top_right": "#20bfcf00",
    "bottom_left": "#108f7000",
    "bottom_right": "#108f7000"
  },
  "border_palette": {
    "top_left": "#40a8a8ff",
    "top_right": "#40bfcfff",
    "bottom_left": "#308f70bf",
    "bottom_right": "#308f70bf"
  }
}
```

> - This is a simple rectangular panel with a subtle green gradient and a soft border.
> - You can tweak the hex ARGB colors (#AARRGGBB) to taste.
{: .prompt-info }

-----

### 2. Create the Style That Uses the Panel

`tooltips/style/uncommon_style.json`:

```json
{
  "panel": "my_tooltips:uncommon_panel",
  "frame": "obscure_tooltips:default",
  "slot": "obscure_tooltips:default",
  "icon": "obscure_tooltips:default",
  "effects": []
}
```

> - `panel` points to the custom panel we created.
> - `frame`, `slot`, `icon` reuse built-in defaults so we change only the background.
> - `effects` must be present even if empty.
{: .prompt-info }

-----

### 3. Create the Definition That Applies the Style to Uncommon Items

`tooltips/definition/uncommon_definition.json`:

```json
{
  "priority": 50,
  "style": "my_tooltips:uncommon_style",
  "filter": {
    "type": "obscure_tooltips:rarity",
    "rarity": "uncommon"
  }
}
```

> - `priority`: higher numbers override lower numbers in the merging system. 50 is arbitrary – pick a number that makes sense in your setup.
> - `filter` uses the rarity filter to target uncommon items only.
{: .prompt-info }

### 4. Save Files and Reload In-Game

1. Save the three JSON files under the `config/fragmentum/assets/...` folder described above.
2. In Minecraft, press `F3 + T` to reload resources (or restart the game).
3. Hover an item with uncommon rarity – your new style should appear.

If nothing changes, check the troubleshooting tips below.

### 5. Troubleshooting & Tips

- **Paths & Namespace** – Make sure the JSON style/panel references match the filenames and the namespace (`my_tooltips:uncommon_panel` matches `.../my_tooltips/tooltips/element/panel/uncommon_panel.json`).
- **Effects Array** – effects must always exist in a style file (even if empty []). Missing it can cause the style to be ignored.
- **JSON Validity** - Use a JSON linter to avoid trailing commas or syntax errors.
- **Layer Precedence** — If another definition with higher priority matches the same items, your style might be partially or fully overridden. Increase priority or adjust filters if necessary.





![separator](/assets/img/separator.png)





## About Elements

### Available Panels

Panels define the visual background of a tooltip and serve as the foundation for text and other elements.

#### 1. [Blank Panel](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/element/panel/BlankPanel.java)

Essentially, it acts as an invisible placeholder.

```json
{
  "type": "obscure_tooltips:blank"
}
```

#### 2. [Color Rect Panel](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/element/panel/ColorRectPanel.java)

A rectangular panel with a border styled after the vanilla design. The gradient palette can be customized for both the panel surface and its border. See [Colors](#colors) for more details.

```json
{
  "type": "obscure_tooltips:color_rect",
  "background_palette": {
    "top_left": "#f0100010",
    "top_right": "#f0100010",
    "bottom_left": "#f0100010",
    "bottom_right": "#f0100010"
  },
  "border_palette": {
    "top_left": "#505000ff",
    "top_right": "#505000ff",
    "bottom_left": "#5028007f",
    "bottom_right": "#5028007f"
  }
}
```

<br>

### Available Frames

Frames are decorative layers drawn on top of panels in tooltips.

#### 1. [Blank Frame](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/element/frame/BlankFrame.java)

Essentially, it acts as an invisible placeholder.

```json
{
  "type": "obscure_tooltips:blank"
}
```

#### 2. [Nine Sliced Frame](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/element/frame/NineSlicedFrame.java)

This frame uses a texture divided into 9 sections to automatically stretch and align the corners and edges of the tooltip. You can use the built-in [golden_frame.png](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/resources/packs/vibrant_tooltips/assets/vibrant_tooltips/textures/gui/golden_frame.png) as a reference for positioning your own textures.

```json
{
  "type": "obscure_tooltips:nine_sliced",
  "texture_sheet": "obscure_tooltips:textures/gui/golden_frame.png"
}
```

<br>

### Available Slots

#### 1. [Blank Slot](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/element/slot/BlankSlot.java)

Essentially, it acts as an invisible placeholder.

```json
{
  "type": "obscure_tooltips:blank"
}
```

#### 2. [Color Rect Slot](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/element/slot/ColorRectSlot.java)

A rectangular panel with a borders.

```json
{
  "type": "obscure_tooltips:color_rect",
  "borders": "#30ffffff",
  "palette": {
    "top_left": "#20ffffff",
    "top_right": "#20ffffff",
    "bottom_left": "#20ffffff",
    "bottom_right": "#20ffffff"
  }
}
```

<br>

### Available Icons

#### 1. [Blank Icon](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/element/icon/BlankIcon.java)

Essentially, it acts as an invisible placeholder.

```json
{
  "type": "obscure_tooltips:blank"
}
```

#### 2. [Static Icon](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/element/icon/StaticIcon.java)

See [Transform](#transform) for more details.

```json
{
  "type": "obscure_tooltips:static",
  "transform": {
    "offset": [ 0.0, 0.0, 0.0 ],
    "scale": 1.0,
    "rotation": 0.0
  }
}
```

#### 3. [Accent Icon](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/element/icon/AccentIcon.java)

```json
{
  "type": "obscure_tooltips:accent",
  "transform": {
    "offset": [ 0.0, 0.0, 0.0 ],
    "scale": 1.0,
    "rotation": 0.0
  }
}
```

#### 4. [Accent Spin Icon](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/element/icon/AccentSpinIcon.java)

```json
{
  "type": "obscure_tooltips:accent_spin",
  "transform": {
    "offset": [ 0.0, 0.0, 0.0 ],
    "scale": 1.0,
    "rotation": 0.0
  }
}
```

#### 5. [Accent Burst Icon](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/element/icon/AccentBurstIcon.java)

```json
{
  "type": "obscure_tooltips:accent_burst",
  "transform": {
    "offset": [ 0.0, 0.0, 0.0 ],
    "scale": 1.0,
    "rotation": 0.0
  }
}
```

<br>

### Available Effects

#### 1. [Rim Light Effect](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/element/effect/RimLightEffect.java)

```json
{
  "type": "obscure_tooltips:rim_light",
  "outer_palette": {
    "top_left": "#30f00fff",
    "top_right": "#30f00fff",
    "bottom_left": "#30f00fff",
    "bottom_right": "#30f00fff"
  },
  "inner_palette": {
    "top_left": "#00ff00ff",
    "top_right": "#00ff00ff",
    "bottom_left": "#00ff00ff",
    "bottom_right": "#00ff00ff"
  }
}
```

#### 2. [Ray Glow Effect](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/element/effect/RayGlowEffect.java)

```json
{
  "type": "obscure_tooltips:ray_glow",
  "primary_color": "#fff00fff",
  "secondary_color": "#ffff5e0f"
}
```

#### 3. [Inward Particle Effect](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/element/effect/InwardParticleEffect.java)

See [Particles](#particles) for more details.

```json
{
  "type": "obscure_tooltips:inward_particle",
  "particle": {
    "type": "obscure_tooltips:line",
    "center_color": "#80ff80ff",
    "edge_color": "#00aa40aa",
    "transform": {
      "offset": [ 0.0, 0.0, 0.0 ],
      "scale": 1.0,
      "rotation": 0.0
    }
  }
}
```

#### 4. [Icon Particle Effect](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/element/effect/IconParticleEffect.java)

```json
{
  "type": "obscure_tooltips:icon_particle",
  "particle": {
    "type": "obscure_tooltips:texture",
    "texture": "obscure_tooltips:textures/gui/particle/star.png",
    "transform": {
      "offset": [ -0.5, -0.5, 0.0 ],
      "scale": 1.5,
      "rotation": 0.0
    }
  }
}
```





![separator](/assets/img/separator.png)





## About Styles

Style files simply combine elements to define the visual appearance of a style.

```json
{
  "panel": "obscure_tooltips:default",
  "frame": "obscure_tooltips:default",
  "slot": "obscure_tooltips:default",
  "icon": "obscure_tooltips:default",
  "effects": []
}
```

> Note that all fields except `effects` are optional. The `effects` array **must always be included**, even if it is empty.
{: .prompt-info }





![separator](/assets/img/separator.png)





## About Definitions

Definition files determine which items a style should apply to, based on the specified filter. In the example below, the style located at `assets/obscure_tooltips/tooltips/style/default.json` will be applied to **all items**:

```json
{
  "priority": 0,
  "style": "obscure_tooltips:default",
  "filter": {
    "type": "obscure_tooltips:always"
  }
}
```

The `priority` field is used in the style merging system.

### Style Merging (Fallback)

A key feature of Obscure Tooltips is the style merging system. When an item matches multiple Definition files, the styles from these definitions are combined according to the following rules:
1. The style with the **highest priority** becomes the base.
2. Any **empty fields** (i.e., Optional elements not defined) in this base style are filled in from the next style in priority. This process continues through all matching styles, in order of priority.
3. The **effect lists** from all styles are merged together.

**Why is this useful?**
 
Suppose you create a `default.json` definition with **minimal priority**, fill in all style elements (panel, frame, slots, icons, etc.), and set its filter to `obscure_tooltips:always`. This style will apply to **all items** by default.

Next, you create an `enchanted.json` definition for enchanted items, assign a style with a fancy frame and glow effects, but leave other elements (like the panel) empty. You set a **higher priority** and a filter for enchanted items only.

**Now:**
- All items will use `default.json` as their base style.
- Enchanted items will override the base frame and gain the additional glow effect from `enchanted.json`.
- Any undefined style fields in `enchanted.json` will fall back to the corresponding fields in `default.json`.

> This system allows you to layer styles, avoid repetition, and easily create complex tooltip designs that automatically adapt to different item types.
{: .prompt-info }





![separator](/assets/img/separator.png)





## About Filters

Filters are not registered as separate files – instead, they are written inline wherever they are needed:

```json
"filter": {
  "type": "obscure_tooltips:always"
}
```

Although filter fields are not arrays, you can still combine multiple filters using the aggregate types `all_of`, `any_of`, and `none_of`:

```json
"filter": {
  "type": "obscure_tooltips:all_of",
  "terms": [
    {
      "type": "obscure_tooltips:<first_filter>"
    },
    {
      "type": "obscure_tooltips:<second_filter>"
    }
  ]
}
```

You can also nest aggregate filters inside one another to create more advanced filtering logic.

<br>

### 1. [Always Filter](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/filter/AlwaysFilter.java)

```json
"filter": {
  "type": "obscure_tooltips:always"
}
```

### 2. [Never Filter](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/filter/NeverFilter.java)

```json
"filter": {
  "type": "obscure_tooltips:never"
}
```

### 3. [All Of Filter](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/filter/AllOfFilter.java)

```json
"filter": {
  "type": "obscure_tooltips:all_of",
  "terms": []
}
```

### 4. [Any Of Filter](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/filter/AnyOfFilter.java)

```json
"filter": {
  "type": "obscure_tooltips:any_of",
  "terms": []
}
```

### 5. [None Of Filter](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/filter/NoneOfFilter.java)

```json
"filter": {
  "type": "obscure_tooltips:none_of",
  "terms": []
}
```

### 6. [Item Or Tag Filter](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/filter/ItemOrTagFilter.java)

```json
"filter": {
  "type": "obscure_tooltips:item",
  "values": [
    "minecraft:apple",
    "#minecraft:planks"
  ]
}
```

### 7. [Mod Filter](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/filter/ModFilter.java)

```json
"filter": {
  "type": "obscure_tooltips:mod",
  "mods": [
    "minecraft",
    "aquamirae"
  ]
}
```

### 8. [Enchantment Filter](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/filter/EnchantmentFilter.java)

```json
"filter": {
  "type": "obscure_tooltips:enchantment",
  "any_enchantment": true,
  "any_curse": true,
  "enchantments": [
    "Minecraft:fire_aspect"
  ]
}
```

### 9. [Rarity Filter](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/filter/RarityFilter.java)

```json
"filter": {
  "type": "obscure_tooltips:rarity",
  "rarity": "epic"
}
```

### 10. [NBT Filter](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/filter/NbtFilter.java)

```json
"filter": {
  "type": "obscure_tooltips:nbt",
  "nbt": "{test_tag:{sub_tag:1}}"
}
```

### 11. [Property Filter](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/filter/PropertyFilter.java)

```json
"filter": {
  "type": "obscure_tooltips:property",
  "has_foil": true
}
```





![separator](/assets/img/separator.png)





## About Labels

Label files define the additional line of text displayed beneath an item’s name. Using **providers**, labels can display the item’s rarity or custom text. If an item matches multiple label definitions, the one with the **highest priority** is applied.

For example, the following file will display the **rarity label** for **all items**:

```json
{
  "priority": 0,
  "provider": {
    "type": "obscure_tooltips:rarity"
  },
  "filter": {
    "type": "obscure_tooltips:always"
  }
}
```

<br>

### 1. [Rarity Label Provider](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/label/RarityLabelProvider.java)

```json
"provider": {
  "type": "obscure_tooltips:rarity"
}
```

### 2. [Literal Label Provider](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/label/LiteralLabelProvider.java)

```json
"provider": {
  "type": "obscure_tooltips:literal",
  "text": "Some Text"
}
```

### 3. [Translatable Label Provider](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/label/TranslatableLabelProvider.java)

```json
"provider": {
  "type": "obscure_tooltips:translatable",
  "key": "label.my_mod.some_text"
}
```





![separator](/assets/img/separator.png)





## Miscellaneous

### Colors

Whenever you need to define a color, you can use one of the following formats:

- **Hexadecimal (ARGB)** – a string in the form #AARRGGBB
- **Decimal (ARGB)** — a 32-bit unsigned integer value
- **Normalized float array (ARGB)** — an array of four values in the range 0.0–1.0, representing [Alpha, Red, Green, Blue]

```json
{
  "color": "#ffffffff",
  "color": 4294967295,
  "color": [ 1.0, 1.0, 1.0, 1.0 ]
}
```

### Transform

The transform object is always optional. If omitted, default values are used. Each property inside transform is also optional and will fall back to its own default.

- **offset** — a 3D vector [x, y, z] that shifts the object’s position
- **scale** — a uniform scale factor (default: 1.0)
- **rotation** — a rotation angle in degrees (default: 0.0)

```json
"transform": {
  "offset": [ 0.0, 0.0, 0.0 ],
  "scale": 1.0,
  "rotation": 0.0
}
```

### Particles

Particles are used by certain effects. There are multiple particle types available:

#### 1. [Line Particle](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/particle/LineParticle.java)

A horizontal line one pixel thick, with a gradient fading toward the center.

```json
"particle": {
  "type": "obscure_tooltips:line",
  "center_color": "#ffffffff",
  "edge_color": "#00ffffff",
  "transform": {}
}
```

#### 2. [Texture Particle](https://github.com/ObscuriaLithium/obscure-tooltips/blob/master/common/src/main/java/dev/obscuria/tooltips/client/tooltip/particle/TextureParticle.java)

A particle rendered from a square texture. Any 1:1 resolution texture can be used, but with the default scale it is treated as having a virtual size of 16x16 pixels.

```json
"particle": {
  "type": "obscure_tooltips:texture",
  "texture": "obscure_tooltips:textures/gui/particle/star.png",
  "transform": {}
}
```





![separator](/assets/img/separator.png)





## Overriding

You can completely disable the built-in styles by turning off the **Vibrant Tooltips** resource pack. This lets you create your own styles and definitions on a clean slate, without needing to override the built-in resources.

## Hotswap

While developing a resource pack, you can quickly reload your changes in-game by pressing `F3 + T` inside a Minecraft world.

## Any Questions?

Join my [Discord Server](https://dsc.gg/obscuria) or ask your question in the comments at the bottom of this page.
