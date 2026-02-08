---
title: Maestro
date: 2026-02-05 16:00:00 -0300
last_modified_at: 2026-02-05 16:00:00 -0300
layout: post
icon_url: /assets/img/mods/maestro/icon.png
icon: fas fa-book
order: 4
toc: true
comments: true
---

**Maestro** is a data-driven music orchestration framework for Minecraft, giving modpack and map creators full control over music behavior. The information provided here is intended to help understand the key concepts of the mod and customize it to your needs.





![separator](/assets/img/mods/maestro/separator.png)





## **Core Concepts**

Maestro is built around the idea that music should be continuous, reactive, and context-aware. Instead of treating music as isolated tracks separated by silence, Maestro treats it as an evolving soundtrack that responds to gameplay in real time.

All music behavior is fully data-driven and configured either through **resource packs** or via the **config folder** using the [Fragmentum Layer](/fragmentum-layer/) system.

<br>

### **Resource Loading** 

Maestro loads music definitions from both **resource packs** and **Fragmentum Layer**. Both sources use **exactly the same format** and are processed identically.

```text
assets/
└── <namespace>/          -> the namespace of your pack
    ├── sounds.json       -> sound event registration
    ├── sounds/           -> audio files (.ogg)
    └── music/            -> maestro music definitions
```

<br>

### **Music Layers**

Maestro organizes music into two logical layers, each with a clear purpose:
- **UNDERSCORE**: The persistent background layer.
Used for ambient and exploratory music tied to dimensions, biomes, time of day, or other slowly changing conditions.
- **ENCOUNTER**: A dynamic foreground layer.
Used for temporary situations such as structures, boss fights, special events, or short-lived encounters.

When an Encounter track becomes active, the Underscore layer smoothly fades down in volume instead of stopping. Importantly, the background music keeps its progress while muted – so when the encounter ends, the underscore fades back in naturally, continuing from where it left off instead of restarting.

<br>

### **Priority System**

Multiple music definitions can match the same game state at the same time. Priorities are evaluated **within each music layer independently**. When multiple definitions compete in the same layer, Maestro selects the one with the **highest priority**.

<br>

### **Vanilla Integration & Fallback**

Maestro integrates directly with Minecraft's vanilla music system and preserves full compatibility with it. Vanilla music is always treated as part of the **Underscore** layer. If Maestro cannot find a matching music definition for the Underscore layer, it automatically falls back to vanilla music selection and lets Minecraft choose the appropriate track.

This means:
- Vanilla biome and dimension music continues to work as expected
- Mods that rely on the vanilla music system remain fully compatible
- Maestro only takes control where custom definitions are explicitly provided

Encounter music never pulls from vanilla sources and is handled exclusively through Maestro definitions. As soon as a Maestro Underscore definition becomes applicable again, it smoothly takes over from vanilla playback without breaking musical continuity.





![separator](/assets/img/mods/maestro/separator.png)





## **Sounds**

### **Audio Format**

Minecraft plays sounds using the **OGG** audio format. Maestro does not introduce a custom audio system – it works **entirely on top of vanilla Minecraft sound handling**.

Any audio file (`.mp3`, `.wav`, `.flac`, etc.) must be converted to `.ogg`. Once converted, Maestro treats the sound exactly like a vanilla music track.

<br>

#### **Converting Audio to OGG**

You can convert audio files using tools like:
- **Audacity** (free, cross-platform)
- ffmpeg
- any audio editor capable of exporting `.ogg`

**Basic Audacity workflow:**
1.	Open your audio file
2.	File -> Export Audio -> Format: Ogg Vorbis Files
3.	Use default settings (they are sufficient)
4.	Save the file under  `assets/<namespace>/sounds/`

<br>

### **Registering Sounds**

Before Maestro can reference a track, it must be **registered as a vanilla sound event** using the standard [`sounds.json`](https://minecraft.wiki/w/Sounds.json) file.

> Maestro references **sound events**, not raw audio files. `sounds.json` assigns a sound event ID to one or more `.ogg` files, which Maestro then uses in music definitions.
{: .prompt-info }

<br>

### **Example: sounds.json**

```json
{
  "music.biome.frozen_ocean": {
    "sounds": [
      {
        "name": "my_namespace:my_audio_file",
        "stream": true
      }
    ]
  },
  "music.boss.captain_cornelia": {
    "sounds": [
      {
        "name": "my_namespace:other_audio_file",
        "stream": true
      }
    ]
  }
}
```

This registers the following files:

```text
assets/my_namespace/sounds/my_audio_file.ogg
assets/my_namespace/sounds/other_audio_file.ogg
```

and exposes them as sound events:

```text
my_namespace:music.biome.frozen_ocean
my_namespace:music.boss.captain_cornelia
```

<br>

### **Multiple Files per Sound Event**

A single sound event can reference **multiple audio files**.

If multiple sounds are registered under the same ID, Minecraft will **randomly choose one** each time the track starts. This is useful for adding subtle variation without additional logic.

<br>

### **Why stream: true?**

Music tracks should always be registered with `"stream": true`.

Streaming tells Minecraft to:
- Load the audio gradually instead of fully into memory
- Avoid memory spikes for long tracks
- Behave consistently with vanilla music playback

Short sound effects usually do not need streaming – music does.

<br>

### **Naming Conventions**

Use clear, self-describing sound event names:
- ✅ `music.biome.frozen_ocean`
- ✅ `music.boss.captain_cornelia`
- ❌ `track1`
- ❌ `some_music`

Good naming makes music definitions easier to read, debug, and maintain.





![separator](/assets/img/mods/maestro/separator.png)





## **Music Definitions**

Music definitions describe **what music should play** and **under which in-game conditions**. Each definition is evaluated dynamically, and the one with the highest priority that matches the current game state is selected.

### **Basic Definition**

```json
{
  "priority": 0,
  "layer": "underscore",
  "sound_event": "minecraft:music_disc.pigstep",
  "condition": {
    "type": "maestro:always"
  }
}
```

| Field         | Type           | Description                                                                                  |
| ------------- | -------------- | -------------------------------------------------------------------------------------------- |
| `priority`    | **Inreger**    | Determines priority within the same layer.<br>Higher values take precedence over lower ones. |
| `layer`       | **Enum Value** | Target music layer. Supported values:<br>`underscore`, `encounter`.                          |
| `sound_event` | **Identifier** | Reference to a sound event (`namespace:path`).                                               |
| `condition`   | **Condition**  | Defines when this music definition is<br>considered valid.                                   |

### **Example: Biome & Weather Based Definition**

```json
{
  "priority": 100,
  "layer": "underscore",
  "sound_event": "my_namespace:music.blizzard",
  "condition": {
    "type": "maestro:all_of",
    "terms": [
      {
        "type": "maestro:biome",
        "values": [ 
          "minecraft:snowy_beach",
          "minecraft:frozen_ocean" 
        ]
      },
      {
        "type": "maestro:weather",
        "is_snowing": true
      }
    ]
  }
}
```

This definition plays the custom blizzard music track when the player is located in either the **Snowy Beach** or **Frozen** Ocean biome **and** it is currently snowing.





![separator](/assets/img/mods/maestro/separator.png)





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

Checks whether the player is currently located in a specific biome, defined either by **biome ID**.

```json
"condition": {
  "type": "maestro:biome",
  "values": [
    "minecraft:plains",
    "minecraft:ocean"
  ]
}
```

<br>

### [**Biome Tag Condition**](https://github.com/ObscuriaLithium/maestro/blob/79de5700e7d1340d8366125fd064542afe3e340a/common/src/main/java/dev/obscuria/maestro/client/music/condition/BiomeTagCondition.java)

Checks whether the player is currently located in a specific biome, defined either by **biome Tag**.

```json
"condition": {
  "type": "maestro:biome_tag",
  "tag_key": "minecraft:is_desert"
}
```

<br>

### [**Weather Condition**](https://github.com/ObscuriaLithium/maestro/blob/79de5700e7d1340d8366125fd064542afe3e340a/common/src/main/java/dev/obscuria/maestro/client/music/condition/WeatherCondition.java)

Checks the current **weather state** at the player’s position.

```json
"condition": {
  "type": "maestro:weather",
  "is_raining": true,
  "is_snowing": true,
  "is_trundering": true
}
```

| Field           | Type                   | Description                                                              |
| --------------- | ---------------------- | ------------------------------------------------------------------------ |
| `is_raining`    | **Boolean** (Optional) | If specified, requires the world to be in the matching<br>rain state.    |
| `is_snowing`    | **Boolean** (Optional) | If specified, requires the world to be in the matching<br>snow state.    |
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





![separator](/assets/img/mods/maestro/separator.png)





## **Best Practices**

### **1. Use Namespaces Consistently**

Always prefix your resources with your modpack namespace:

- ✅ `"assets/my_pack/music"`

- ❌ `"assets/maestro/music"`

### **2. Use Clear and Descriptive Naming**

Choose file names that **describe their purpose at a glance** and naturally group related definitions together.

Prefer names that reflect **what the music reacts to**, not vague or generic concepts:

- ✅ `"music/underscore/biome.frozen_ocean.json"`
- ✅ `"music/encounter/entity.wither.json"`

Avoid names that hide intent or lump unrelated logic together:

- ❌ `"music/some_biomes.json"`
- ❌ `"music/boss_music.json"`





![separator](/assets/img/mods/maestro/separator.png)





## **Troubleshooting**

### **1. Music Not Playing**

1. **Check file locations** – Ensure files are in correct directories
2. **Validate JSON** – Use a JSON validator to check syntax
3. **Check priorities** – Higher priority definitions override lower ones
4. **Verify conditions** – Ensure your conditions actually works
5. **Check logs** – Look for error messages in `latest.log`





![separator](/assets/img/mods/maestro/separator.png)





## **Additional Resources**

### **Community Resources**

- **Example Pack**: [https://github.com/ObscuriaLithium/maestro-overture](https://github.com/ObscuriaLithium/maestro-overture)
- **CurseForge**: [https://www.curseforge.com/minecraft/mc-mods/maestro](https://www.curseforge.com/minecraft/mc-mods/maestro)
- **Modrinth**: [https://www.curseforge.com/minecraft/mc-mods/maestro-music](https://www.curseforge.com/minecraft/mc-mods/maestro-music)
- **Issues**: Report bugs and request features on GitHub
- **Discord**: Join the community for support and examples