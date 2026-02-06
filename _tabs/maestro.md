---
title: Maestro
date: 2026-02-05 16:00:00 -0300
last_modified_at: 2026-02-05 16:00:00 -0300
layout: post
icon_url: /assets/img/tabs/maestro.png
icon: fas fa-book
order: 4
toc: true
comments: true
---

**Maestro** is a client-side, data-driven music orchestration framework for Minecraft, giving modpack and map creators full control over music behavior. The information provided here is intended to help understand the key concepts of the mod and customize it to your needs.





![separator](/assets/img/separator.png)





## **Core Concepts**

Maestro music definitions is fully data-driven. All customization is done either through a **custom resource pack**, or in a **config-like way** using [Fragmentum Layer](/fragmentum-layer/), without needing to package or enable anything manually.

### **Resource Loading** 

Maestro loads music definitions from both **resource packs** and **Fragmentum Layer**. Both sources use **exactly the same format** and are processed identically.

```text
assets/
└── <namespace>/          -> the namespace of your pack
    ├── sounds.json       -> vanilla sound event registration
    ├── sounds/           -> audio files (.ogg)
    └── music/            -> music definitions
```

### **Priority System**

Multiple music definitions can match the same game state at the same time. When this happens, Maestro selects the definition with the **highest priority**.

This system allows you to layer music logic naturally, for example:

1. Set base background music (priority 0)
2. Biome-specific overrides (priority 100)
3. Screen- or UI-specific music (priority 200)
4. Boss or special encounter music (priority 300)

### **Vanilla Fallback**

If Maestro cannot find a matching music definition, it **automatically falls back to vanilla Minecraft music selection**.

Under the hood, Maestro works entirely on top of vanilla music mechanics, acting as a higher-priority layer rather than a replacement. This guarantees **seamless integration** and ensures that vanilla behavior remains intact when no custom music applies.





![separator](/assets/img/separator.png)





## **Resource Structure**

### **Example Pack Structure**

```text
resourcepacks/
└── MyCustomMusic.zip/
    ├── pack.mcmeta
    └── assets/
        └── my_namespace/
            ├── sounds.json
            ├── sounds/
            │   ├── ambient/
            │   │   └── frozen_winds.ogg
            │   ├── biome/
            │   │   ├── taiga.ogg
            │   │   └── frozen_ocean.ogg
            │   └── boss/
            │       └── captain_cornelia.ogg
            └── music/
                ├── default.json
                ├── biome.taiga.json
                ├── biome.frozen_ocean.json
                ├── screen.title.json
                └── entity.captain_cornelia.json
```

> **Namespace Convention**
> - Use your modpack/resourcepack namespace (e.g., `my_modpack`)
> - Reference built-in elements with `maestro:`
{: .prompt-tip }

<br>

### **Audio Format**

Minecraft plays music using the **OGG** audio format. Maestro does not introduce a custom audio system – it works **entirely on top of vanilla Minecraft sound handling**.

> Any audio format (`.mp3`, `.wav`, `.flac`, etc.) must be converted to `.ogg`. Once converted, Maestro treats the sound exactly like a vanilla track.
{: .prompt-info }

#### **Converting Audio to OGG**

You can convert audio files using tools like:
- **Audacity** (free, cross-platform)
- ffmpeg
- any audio editor capable of exporting .ogg

Basic Audacity workflow:
1.	Open your audio file
2.	File -> Export -> Export as OGG
3.	Use default settings (they are fine)
4.	Save the file into your resource pack under `assets/<namespace>/sounds/`

If Minecraft can play the sound, Maestro can use it.

<br>

### **Registering Sounds**

Before Maestro can reference a music track, the sound must be **registered in vanilla Minecraft**. This is done using the standard [`sounds.json`](https://minecraft.wiki/w/Sounds.json) file.

> Maestro references **sound events**, not raw audio files. 
> `sounds.json` assigns a **sound event ID** to your .ogg file, which Maestro can then use in music definitions.
{: .prompt-info }

#### **Example: sounds.json**

```json
{
  "music.biome.frozen_ocean": {
    "category": "music",
    "sounds": [
      {
        "name": "my_namespace:biome/frozen_ocean",
        "stream": true
      }
    ]
  },
  "music.boss.captain_cornelia": {
    "category": "music",
    "sounds": [
      {
        "name": "my_namespace:boss/captain_cornelia",
        "stream": true
      }
    ]
  }
}
```

This registers the following sound files:

```text
assets/my_namespace/sounds/biome/frozen_ocean.ogg
assets/my_namespace/sounds/boss/captain_cornelia.ogg
```

and exposes them as the following **sound events**:

```text
my_namespace:music.biome.frozen_ocean
my_namespace:music.boss.captain_cornelia
```





![separator](/assets/img/separator.png)





## **Music Definitions**

Music definitions describe **what music should play** and **under which in-game conditions**. Each definition is evaluated dynamically, and the one with the highest priority that matches the current game state is selected.

### **Basic Definition**

```json
{
  "priority": 100,
  "sound_event": "minecraft:music_disc.pigstep",
  "replace_current_music": true,
  "min_delay": 1200,
  "max_delay": 2400,
  "condition": {
    "type": "maestro:always"
  }
}
```

### **Fields**

| Field                   | Type                   | Description                                                                                          |
| ----------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------- |
| `priority`              | **Inreger**            | Determines override order. Higher values<br>take precedence over lower ones.                         |
| `sound_event`           | **Identifier**         | Reference to a sound event<br>(`namespace:path`).                                                    |
| `replace_current_music` | **Boolean** (Optional) | Whether this track should immediately<br>replace any currently playing music.<br>Defaults to `false` |
| `min_delay`             | **Integer** (Optional) | Minimum delay before the next track<br>may start (in ticks). Defaults to `1200`                      |
| `max_delay`             | **Integer** (Optional) | Maximum delay before the next track<br>may start (in ticks). Defaults to `2400`                      |
| `condition`             | **Condition**          | Defines when this music definition<br>is considered valid.                                           |

### **Example: Biome & Weather Based Definition**

```json
{
  "priority": 400,
  "sound_event": "my_namespace:music.event.blizzard",
  "condition": {
    "type": "maestro:all_of",
    "terms": [
      {
        "type": "maestro:biome",
        "biomes": [ 
          "minecraft:snowy_beach",
          "minecraft:frozen_ocean" 
        ]
      },
      {
        "type": "maestro:weather",
        "is_raining": true
      }
    ]
  }
}
```

This definition plays the vanilla **Pigstep** music track when the player is located in either the **Snowy Beach** or **Frozen** Ocean biome **and** it is currently raining.

> Because `replace_current_music` is not specified and defaults to `false`, this track will only start if:
> - no other music is currently playing, and
> - the delay timer from the previous track has already elapsed.
> 
> This makes the definition suitable for **ambient**, **non-intrusive background music** that should not interrupt higher-priority or already playing tracks.
{: .prompt-info }





![separator](/assets/img/separator.png)





## **Music Conditions**

Conditions define **which game state** a music definition applies to. They are evaluated dynamically and can be **combined using logical** operators to describe complex scenarios.

<br>

### [**Always Condition**](https://github.com/ObscuriaLithium/maestro/blob/79de5700e7d1340d8366125fd064542afe3e340a/common/src/main/java/dev/obscuria/maestro/client/music/condition/AlwaysCondition.java)

Always evaluates to `true`.

This condition is useful for:
- global or fallback music,
- testing and debugging,
- base background layers.

```json
"condition": {
  "type": "maestro:always"
}
```

<br>

### [**Never Condition**](https://github.com/ObscuriaLithium/maestro/blob/79de5700e7d1340d8366125fd064542afe3e340a/common/src/main/java/dev/obscuria/maestro/client/music/condition/NeverCondition.java)

Always evaluates to `false`.

This condition is mainly useful for:
- temporarily disabling a definition,
- placeholders in resource packs,
- debugging priority or condition logic.

```json
"condition": {
  "type": "maestro:never"
}
```

<br>

### [**Biome Condition**](https://github.com/ObscuriaLithium/maestro/blob/79de5700e7d1340d8366125fd064542afe3e340a/common/src/main/java/dev/obscuria/maestro/client/music/condition/BiomeCondition.java)

Checks whether the player is currently located in a specific biome, defined either by **biome ID** or **biome tag**.

```json
"condition": {
  "type": "maestro:biome",
  "biomes": [
    "minecraft:some_biome",
    "#minecraft:some_biome_tag"
  ]
}
```

#### **Syntax**

- `namespace:biome_id` – a specific biome
- `#namespace:tag_name` - a biome tag (matches all biomes with this tag)

<br>

### [**Weather Condition**](https://github.com/ObscuriaLithium/maestro/blob/79de5700e7d1340d8366125fd064542afe3e340a/common/src/main/java/dev/obscuria/maestro/client/music/condition/WeatherCondition.java)

Checks the current **weather state** at the player’s position.

```json
"condition": {
  "type": "maestro:weather",
  "is_raining": true,
  "is_trundering": true
}
```

#### **Fields**

| Field           | Type                   | Description                                                              |
| --------------- | ---------------------- | ------------------------------------------------------------------------ |
| `is_raining`    | **Boolean** (Optional) | If specified, requires the world to be in the matching<br>rain state.    |
| `is_thundering` | **Boolean** (Optional) | If specified, requires the world to be in the matching<br>thunder state. |

<br>

### [**Entity Condition**](https://github.com/ObscuriaLithium/maestro/blob/79de5700e7d1340d8366125fd064542afe3e340a/common/src/main/java/dev/obscuria/maestro/client/music/condition/EntityCondition.java)

Checks for the presence of a specific entity within a **square area** centered on the player.

```json
"condition": {
  "type": "maestro:entity",
  "entity": "minecraft:wither",
  "distance": 64
}
```

#### **Fields**

| Field      | Type                   | Description                                                                                           |
| ---------- | ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `entity`   | **Identifier**         | The entity ID to check for.                                                                           |
| `distance` | **Integer** (Optional) | Half-size of the square detection area in all directions,<br>centered on the player. Defaults to `64` |

<br>

### [**Screen Condition**](https://github.com/ObscuriaLithium/maestro/blob/79de5700e7d1340d8366125fd064542afe3e340a/common/src/main/java/dev/obscuria/maestro/client/music/condition/ScreenCondition.java)

Checks whether a specific **GUI screen** is currently open.

```json
"condition": {
  "type": "maestro:screen",
  "kind": "title",
  "class_path": "net.minecraft.client.gui.screens.TitleScreen"
}
```

#### **Fields**

| Field        | Type                      | Description                                                                                                                                                                 |
| ------------ | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kind`       | **Enum Value** (Optional) | If present, checks the current screen against a<br>predefined category: `title`, `credits`,<br>`inventory`, or `pause`.                                                     |
| `class_path` | **String** (Optional)     | If present, checks whether the current screen is an<br>instance of the specified class. This is an advanced<br>option – use only if you know exactly what you<br>are doing. |

<br>

### **Logical Operators**

#### **All Of (AND)**

All conditions must be true:

```json
"condition": {
  "type": "maestro:all_of",
  "terms": []
}
```

#### **Any Of (OR)**

At least one condition must be true:

```json
"condition": {
  "type": "maestro:any_of",
  "terms": []
}
```

#### **None Of (NOT)**

No conditions can be true:

```json
"condition": {
  "type": "maestro:none_of",
  "terms": []
}
```





![separator](/assets/img/separator.png)





## **Best Practices**

### **1. Use Namespaces Consistently**

Always prefix your resources with your modpack namespace:

- ✅ `"assets/my_pack/music"`

- ❌ `"assets/maestro/music"`

### **2. Use Clear and Descriptive Naming**

Choose file names that **describe their purpose at a glance** and naturally group related definitions together.

Prefer names that reflect **what the music reacts to**, not vague or generic concepts:

- ✅ `"biome.frozen_ocean.json"`
- ✅ `"entity.wither.json"`

Avoid names that hide intent or lump unrelated logic together:

- ❌ `"some_biomes.json"`
- ❌ `"boss_music.json"`

### **3. Layer Priorities Thoughtfully**

Define a clear and consistent **priority hierarchy** to avoid conflicts and ensure predictable music behavior:

- **0–99** – Base background music
- **100–199** – Biome-specific music
- **200–299** – Screen- and UI-based music
- **300–399** – Boss music and special encounters
- **400+** – Highly specific overrides and exceptional cases
  
Using structured priority ranges makes your music logic easier to reason about, maintain, and extend over time.





![separator](/assets/img/separator.png)





## **Troubleshooting**

### **1. Music Not Playing**

1. **Check file locations** – Ensure files are in correct directories
2. **Validate JSON** – Use a JSON validator to check syntax
3. **Check priorities** – Higher priority definitions override lower ones
4. **Verify conditions** – Ensure your conditions actually works
5. **Check logs** – Look for error messages in `latest.log`





![separator](/assets/img/separator.png)





## **Additional Resources**

### **Community Resources**

- **CurseForge**: [https://www.curseforge.com/minecraft/mc-mods/maestro](https://www.curseforge.com/minecraft/mc-mods/maestro)
- **Modrinth**: [https://www.curseforge.com/minecraft/mc-mods/maestro-music](https://www.curseforge.com/minecraft/mc-mods/maestro-music)
- **Issues**: Report bugs and request features on GitHub
- **Discord**: Join the community for support and examples