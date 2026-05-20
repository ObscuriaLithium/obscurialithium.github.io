// ── Mods Showcase Data ──────────────────────────────────────────────────────
// Edit this file to update the showcase. All download counts are fetched live
// from CurseForge / Modrinth APIs; the IDs below drive those requests.

export type Platform = 'curseforge' | 'modrinth';
export type Loader  = 'fabric' | 'forge' | 'neoforge' | 'quilt';

export interface ModSource {
  platform: Platform;
  /** CurseForge project numeric ID or Modrinth project slug / ID */
  id: string;
  url: string;
  /** Optional label shown in dropdown when platform has multiple entries e.g. 'Fabric', 'Forge' */
  label?: string;
}

export interface ModGalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ModEntry {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  cover?: string;          // hero cover image (optional – show placeholder if absent)
  gallery?: ModGalleryImage[];
  sources: ModSource[];
  loaders: Loader[];
  /** ISO date string */
  releaseDate: string;
  /** Higher = show bigger card; 'featured' = fullwidth hero card */
  tier: 'featured' | 'major' | 'minor';
  /** Docs page slug, if any */
  docsSlug?: string;
  tags?: string[];
  /** Mark as newest release – floated to very top */
  isNewRelease?: boolean;
  isBeta?: boolean;
  isAlpha?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED / NEW RELEASES  (set isNewRelease: true on the latest one)
// ─────────────────────────────────────────────────────────────────────────────
export const MODS: ModEntry[] = [
  {
    id: 'accents',
    name: 'Accents',
    tagline: 'Dyeable style accents with subtle gameplay bonuses!',
    description:
      'Accents adds stylish cosmetic accessories that subtly enhance gameplay. A variety of visual accents let you personalize your character without turning cosmetics into mandatory gear.',
    icon: '/assets/img/mods/accents.webp',
    cover: 'https://media.forgecdn.net/attachments/1505/498/accents-logo-jpg.jpg',
    sources: [
      { platform: 'curseforge', id: '1446887', url: 'https://www.curseforge.com/minecraft/mc-mods/accents' },
      { platform: 'modrinth',   id: 'accents', url: 'https://modrinth.com/mod/accents' },
    ],
    loaders: ['forge', 'neoforge', 'fabric'],
    releaseDate: '2026-02-02',
    tier: 'major',
    tags: ['cosmetic'],
    isNewRelease: true,
  },

  {
    id: 'aquamirae',
    name: 'Aquamirae',
    tagline: 'Ship graveyard with terrible deep sea creatures!',
    description:
      'Aquamirae expands your world with a frozen ocean biome – the Ice Maze above and a haunting Ship Graveyard beneath. Discover its unique ecosystem, progression, ambience, and lore as you uncover the fate of Captain Cornelia and survive the horrors lurking below the ice.',
    icon: '/assets/img/mods/aquamirae.webp',
    cover: 'https://youtu.be/l2P5w9AkEiQ?si=R9nh7bcVmeQ9SGTZ',
    sources: [
      { platform: 'curseforge', id: '536254', url: 'https://www.curseforge.com/minecraft/mc-mods/aquamirae', label: 'Forge' },
      { platform: 'curseforge', id: '891257', url: 'https://www.curseforge.com/minecraft/mc-mods/aquamirae-fabric', label: 'Fabric' },
      { platform: 'modrinth',   id: 'aquamirae', url: 'https://modrinth.com/mod/aquamirae' },
    ],
    loaders: ['forge', 'fabric'],
    releaseDate: '2021-10-02',
    tier: 'featured',
    tags: ['adventure', 'story'],
  },

  {
    id: 'obscure-tooltips',
    name: 'Obscure Tooltips',
    tagline: 'Stylized tooltips with beautiful effects and smooth animations!',
    description:
      'Obscure Tooltips is a client-side visual enhancement mod that transforms ordinary item tooltips into expressive, animated showcases. It adds immersive visual flair to your inventory by introducing smooth animations, dynamic particle effects, and ornamental accent frames that adapt to item rarity and context.',
    icon: '/assets/img/mods/obscure-tooltips.webp',
    cover: 'https://media.forgecdn.net/attachments/1335/389/obscure-tooltips-logo-jpg.jpg',
    gallery: [
      { src: '/assets/img/snowcase/tooltips-example-style.png', alt: 'Example tooltip style' },
    ],
    sources: [
      { platform: 'curseforge', id: '715660', url: 'https://www.curseforge.com/minecraft/mc-mods/obscure-tooltips' },
      { platform: 'modrinth',   id: 'obscure-tooltips', url: 'https://modrinth.com/mod/obscure-tooltips' },
    ],
    loaders: ['forge', 'neoforge', 'fabric'],
    releaseDate: '2024-03-15',
    tier: 'major',
    docsSlug: 'obscure-tooltips',
    tags: ['UI', 'cosmetic', 'client'],
  },
  {
    id: 'pillager-caravans',
    name: 'Pillager Caravans',
    tagline: 'Roaming pillager caravans with biome-themed loot and guarded convoys!',
    description:
      'Pillager Caravans adds roaming, cargo-filled convoys guarded by pillagers, vindicators, and even ravagers. Instead of static treasure chests, caravans travel across biomes – sometimes near your base – with cargo that changes depending on the environment.',
    icon: '/assets/img/mods/pillager-caravans.webp',
    cover: 'https://media.forgecdn.net/attachments/1342/951/pillager-caravans-logo-jpg.jpg',
    sources: [
      { platform: 'curseforge', id: '1356772', url: 'https://www.curseforge.com/minecraft/mc-mods/pillager-caravans' },
      { platform: 'modrinth',   id: 'pillager-caravans', url: 'https://modrinth.com/mod/pillager-caravans' },
    ],
    loaders: ['forge', 'neoforge', 'fabric'],
    releaseDate: '2024-01-20',
    tier: 'major',
    docsSlug: 'pillager-caravans',
    tags: ['adventure'],
  },
  {
    id: 'ars-elixirum',
    name: 'Ars Elixirum',
    tagline: 'Ultimate extension of potion crafting, applications, and diversity!',
    description:
      'Ars Elixirum is the ultimate extension of potion crafting, applications, and diversity. Through exploration and experimentation, you can create your own recipes to craft Elixirs - powerful replacements for potions - and save and customize them!',
    icon: '/assets/img/mods/ars-elixirum.webp',
    cover: 'https://media.forgecdn.net/attachments/994/291/arselixirum.png',
    sources: [
      { platform: 'curseforge', id: '620870', url: 'https://www.curseforge.com/minecraft/mc-mods/ars-elixirum-forge', label: 'Forge' },
      { platform: 'curseforge', id: '1107849', url: 'https://www.curseforge.com/minecraft/mc-mods/ars-elixirum', label: 'Fabric' },
      { platform: 'curseforge', id: '638419', url: 'https://www.curseforge.com/minecraft/mc-mods/ars-elixirum-neoforge', label: 'NeoForge' },
      { platform: 'modrinth',   id: 'ars-elixirum', url: 'https://modrinth.com/mod/ars-elixirum' },
    ],
    loaders: ['forge', 'neoforge', 'fabric'],
    releaseDate: '2024-04-10',
    tier: 'major',
    tags: ['RPG', 'gameplay'],
    isBeta: true,
  },
  {
    id: 'archogenum',
    name: 'Archogenum',
    tagline: 'A technomagical genetics mod where your body becomes your build',
    description:
      'Archogenum lets you embrace the role of a gene-engineer. Extract, combine, and rewrite the essence of living beings to synthesize unique xenofruits – mutable genetic blueprints that shape your survival, strength, and playstyle.',
    icon: '/assets/img/mods/archogenum.webp',
    cover: 'https://media.forgecdn.net/attachments/1365/384/archogenum-logo-jpg.jpg',
    sources: [
      { platform: 'curseforge', id: '1368580', url: 'https://www.curseforge.com/minecraft/mc-mods/archogenum' },
      { platform: 'modrinth',   id: 'archogenum', url: 'https://modrinth.com/mod/archogenum' },
    ],
    loaders: ['forge', 'fabric'],
    releaseDate: '2024-08-01',
    tier: 'major',
    tags: ['RPG', 'gameplay'],
    isAlpha: true,
  },

  {
    id: 'loot-journal',
    name: 'Loot Journal: Pickup Notifier',
    tagline: 'Item pick-up notifier featuring rich animations and powerful customization options!',
    description:
      'Loot Journal is a client-side mod that enhances item pickups with smooth, animated notifications, smart stacking, and full visual customization. Track your own and nearby players\' pickups in real time, tweak every detail in-game, and enjoy a clean, immersive UI.',
    icon: '/assets/img/mods/loot-journal.webp',
    sources: [
      { platform: 'curseforge', id: '700723', url: 'https://www.curseforge.com/minecraft/mc-mods/loot-journal', label: 'Forge' },
      { platform: 'curseforge', id: '1120388', url: 'https://www.curseforge.com/minecraft/mc-mods/loot-journal-fabric', label: 'Fabric' },
      { platform: 'curseforge', id: '1120395', url: 'https://www.curseforge.com/minecraft/mc-mods/loot-journal-neoforge', label: 'NeoForge' },
      { platform: 'modrinth',   id: 'loot-journal', url: 'https://modrinth.com/mod/loot-journal' },
    ],
    loaders: ['forge', 'neoforge', 'fabric'],
    releaseDate: '2023-03-18',
    tier: 'minor',
    tags: ['UI', 'cosmetic'],
  },
  {
    id: 'maestro',
    name: 'Maestro',
    tagline: 'Reimagine vanilla music with smooth, reactive orchestration!',
    description:
      'Maestro is a data-driven music orchestration framework that extends Minecraft\'s music system, enabling reactive, seamless soundtracks through resource packs.',
    icon: '/assets/img/mods/maestro.webp',
    sources: [
      { platform: 'curseforge', id: '1454351', url: 'https://www.curseforge.com/minecraft/mc-mods/maestro' },
      { platform: 'modrinth',   id: 'maestro-music', url: 'https://modrinth.com/mod/maestro-music' },
    ],
    loaders: ['forge', 'neoforge', 'fabric'],
    releaseDate: '2024-06-01',
    tier: 'minor',
    docsSlug: 'maestro',
    tags: ['library'],
    isBeta: true
  },
  {
    id: 'fragmentum',
    name: 'Fragmentum',
    tagline: 'The lightweight framework for the Obscuria Collection multi-loader mods',
    description:
      'Fragmentum is a lightweight core library used by other Obscuria Collection mods. It does not add any content on its own and only needs to be installed if another mod requires it, as it provides shared tools and a multi-loader architecture that keeps other mods cleaner, simpler, and free from loader-specific code.',
    icon: '/assets/img/mods/fragmentum.webp',
    sources: [
      { platform: 'curseforge', id: '1123970', url: 'https://www.curseforge.com/minecraft/mc-mods/fragmentum', label: 'Forge' },
      { platform: 'curseforge', id: '1123974', url: 'https://www.curseforge.com/minecraft/mc-mods/fragmentum-fabric', label: 'Fabric' },
      { platform: 'curseforge', id: '1123977', url: 'https://www.curseforge.com/minecraft/mc-mods/fragmentum-neoforge', label: 'NeoForge' },
      { platform: 'modrinth',   id: 'fragmentum', url: 'https://modrinth.com/mod/fragmentum' },
    ],
    loaders: ['forge', 'neoforge', 'fabric'],
    releaseDate: '2023-09-10',
    tier: 'minor',
    docsSlug: 'fragmentum-layer',
    tags: ['library'],
  },
  {
    id: 'healight',
    name: 'Healight',
    tagline: 'Green glow when entities heal for clearer feedback',
    description:
      'Healight is a lightweight mod that adds a green glow to entities when they heal, mirroring the red flash effect when they take damage. The mod works seamlessly with all vanilla and modded entities.',
    icon: '/assets/img/mods/healight.webp',
    sources: [
      { platform: 'curseforge', id: '1188428', url: 'https://www.curseforge.com/minecraft/mc-mods/healight' },
      { platform: 'modrinth',   id: 'healight', url: 'https://modrinth.com/mod/healight' },
    ],
    loaders: ['forge', 'neoforge', 'fabric'],
    releaseDate: '2023-05-30',
    tier: 'minor',
    tags: ['cosmetic', 'client'],
  },
  {
    id: 'obscure-api',
    name: 'Obscure API',
    tagline: 'Auxiliary Library',
    description:
      'Obscure API is a shared library used by some mods in the Obscuria Collection. It adds common gameplay systems, an animation framework, and new entity attributes that help these mods work smoothly together.',
    icon: '/assets/img/mods/obscure-api.webp',
    cover: 'https://media.forgecdn.net/attachments/994/291/arselixirum.png',
    sources: [
      { platform: 'curseforge', id: '638417', url: 'https://www.curseforge.com/minecraft/mc-mods/obscure-api', label: 'Forge' },
      { platform: 'curseforge', id: '891234', url: 'https://www.curseforge.com/minecraft/mc-mods/obscure-api-fabric', label: 'Fabric' },
      { platform: 'modrinth',   id: 'obscure-api', url: 'https://modrinth.com/mod/obscure-api' },
    ],
    loaders: ['forge', 'fabric'],
    releaseDate: '2024-04-10',
    tier: 'minor',
    tags: ['library',]
  },
  {
    id: 'archivist',
    name: 'Archivist',
    tagline: 'A lightweight abstraction layer for codec-based data systems',
    description:
      'Archivist is a lightweight abstraction layer for codec-based data systems, originally designed for complex data-driven mods such as Ars Elixirum. It does not add any content on its own and only needs to be installed if required, providing structured and consistent handling of configs, world data, and serialized content.',
    icon: '/assets/img/mods/archivist.webp',
    sources: [
      { platform: 'curseforge', id: '1513409', url: 'https://www.curseforge.com/minecraft/mc-mods/archivist' },
      { platform: 'modrinth',   id: 'archivist-api', url: 'https://modrinth.com/mod/archivist-api' },
    ],
    loaders: ['forge', 'fabric'],
    releaseDate: '2026-04-14',
    tier: 'minor',
    tags: ['library',]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// Social / site links used in footer
// ─────────────────────────────────────────────────────────────────────────────
export const SOCIAL_LINKS = {
  discord:    'https://discord.gg/jSHHJSUWdY',
  curseforge: 'https://www.curseforge.com/members/obscuria/projects',
  modrinth:   'https://modrinth.com/user/obscuria',
  github:     'https://github.com/ObscuriaLithium',
  email:      'mailto:obscurialithium@gmail.com',
};