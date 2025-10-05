---
title: Pillager Caravans
date: 2025-10-05 16:00:00 -0300
last_modified_at: 2025-10-05 16:00:00 -0300
layout: post
icon: fas fa-book
order: 2
toc: true
comments: true
image:
  path: /assets/images/pillager-caravans-logo.jpg
---

**Pillager Caravans** adds roaming, cargo-filled convoys guarded by pillagers, vindicators, and even ravagers. Instead of static treasure chests, caravans travel across biomes – sometimes near your base – with cargo that changes depending on the environment. The information provided here is intended to help understand the core concepts of the mod and customize it to your needs.

## Core Concept

Caravan generation is fully data-driven, meaning everything can be customized with datapacks. It’s divided into two main parts – [Caravan Variations](#caravan-variation) and [Caravan Placements](#caravan-placement):
- **Caravan Variation** defines what a caravan looks like: which mobs are part of it, what cargo it carries, and any special properties it has.
- **Caravan Placement** defines where and when caravans appear, setting their spawn conditions and selecting one of the available variations based on weighted chances.

## Caravan Variation

> Data Pack Directory: `data/<modid>/caravans/variation/`
{: .prompt-tip }

- **cooldown** – The number of ticks (20 ticks = 1 second) before the game tries to spawn another caravan after this one has successfully spawned.
- **leader** – A [Caravan Member](#caravan-member) object that acts as the leader of the caravan. This should be an illager-type mob (including modded ones), a ravager, or at least a witch – only these entities have the necessary AI to travel and lead others.
- **members** – An array of [Caravan Member](#caravan-member) objects that make up the caravan group.
  - All illager-type members will follow their leader.
  - Animals will be leashed to random illager members (except the leader), forming one or more "trains".
  - If no illager members are present, animals won’t be leashed to anyone and will not follow the caravan.

```json
{
  "cooldown": 12000,
  "leader": {
    "type": "minecraft:vindicator"
  },
  "members": [
    {
      "type": "minecraft:pillager",
      "count": 2
    },
    {
      "type": "minecraft:llama",
      "armor": "minecraft:orange_carpet",
      "cargo": "caravans:caravans/cargo/gold",
      "count": 2
    }
  ]
}
```

## Caravan Member

A nested object inside a [Caravan Variation](#caravan-variation) that defines an entity with optional extra parameters. All fields except type are optional and can be omitted.

- **type** – The entity ID.
- **armor** – The armor item worn by the animal (such as horse armor or a carpet for llamas).
- **cargo** – The loot table for the cargo this animal carries. Only llamas, donkeys, mules, or modded animals with cargo support can use this field.
- **count** – How many copies of this entity to spawn. If not specified, only one will appear.

```json
{
  "type": "minecraft:llama",
  "armor": "minecraft:orange_carpet",
  "cargo": "caravans:caravans/cargo/gold",
  "count": 2
}
```

## Caravan Placement

> Data Pack Directory: `data/<modid>/caravans/placement/`
{: .prompt-tip }

- **weight** – How likely this placement file is to be chosen compared to others. If several placements match the same area, one of them will be picked randomly using these weights.
- **biomes** – A single biome ID, a biome tag (like #minecraft:is_forest), or a list of them. Caravans from this placement will only spawn in these biomes.
- **pools** – A list of themed groups of caravan variations.
  - Each pool has its own **weight** – controlling how often that pool is picked.
  - Inside each pool is a list of **variations**, each with a **variation ID** and **weight**.
  - When a caravan spawns, the game first chooses a random pool based on pool weights, then picks one of that pool’s variations by its own weight.

```json
{
  "weight": 1000,
  "biomes": "#caravans:has_desert_caravan",
  "pools": [
    {
      "weight": 2,
      "variations": [
        {
          "variation": "caravans:desert_gold_tier_1",
          "weight": 5
        },
        {
          "variation": "caravans:desert_gold_tier_2",
          "weight": 3
        },
        {
          "variation": "caravans:desert_gold_tier_3",
          "weight": 1
        }
      ]
    },
    {
      "weight": 1,
      "variations": [
        {
          "variation": "caravans:desert_sugar_cane_tier_1",
          "weight": 5
        },
        {
          "variation": "caravans:desert_sugar_cane_tier_2",
          "weight": 3
        },
        {
          "variation": "caravans:desert_sugar_cane_tier_3",
          "weight": 1
        }
      ]
    }
  ]
}
```

## Examples

To see all features in action, check out the built-in Pillager Caravans [data pack](https://github.com/ObscuriaLithium/pillager-caravans/tree/master/common/src/main/resources).

## Overriding

If you want to completely disable the built-in caravans, you can override the [Caravan Placement](#caravan-placement) files in your data pack. Simply follow the standard Minecraft resource override rules and set the biomes array to empty – this will exclude the file from being used during caravan generation.

## Any Questions?

Join my [Discord Server](https://dsc.gg/obscuria) or ask your question in the comments at the bottom of this page.