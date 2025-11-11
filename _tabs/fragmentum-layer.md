---
title: Fragmentum Layer
date: 2025-11-10 12:00:00 -0300
last_modified_at: 2025-11-10 16:00:00 -0300
layout: post
icon: fas fa-layer-group
order: 1
toc: true
comments: true
image:
  path: /assets/images/fragmentum-layer.png
---

**Fragmentum Layer** is a system that lets you create **global datapacks and resource packs directly inside `config/fragmentum/`**, without `pack.mcmeta`, icons, or manually enabling them for each world. Everything you place there is automatically recognized by Minecraft as a fully functional pack – active **globally across all worlds**.

## Folder Structure

```text
config/
└── fragmentum/
    ├── assets/  -> global resource pack (textures, models, languages)
    └── data/    -> global datapack (recipes, loot tables, tags)
```

-----

## How It Works

On startup, Fragmentum creates two virtual packs:
- **Fragmentum Layer Resource Pack** – loads everything from `config/fragmentum/assets/`
- **Fragmentum Layer Datapack** – loads everything from `config/fragmentum/data/`

> They behave exactly like normal Minecraft packs, just stored in your config folder instead of `resourcepacks` or `datapacks`. No activation required – everything works **automatically and globally**.
{: .prompt-info }

-----

## Reloading

- `/reload` – updates changes in `data/`
- `F3 + T` – updates changes in `assets/`