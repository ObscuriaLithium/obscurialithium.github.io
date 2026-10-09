import { MODS, type ModEntry } from './mods';

// Home → Showcase tab. Mods are referenced by id from mods.ts.
export const SHOWCASE = {
  featured: 'aquamirae',
  mainMod: 'pillager-caravans',
  trio: {
    eyebrow: 'Utility mods',
    title: 'Small mods, sharp details.',
    mods: ['loot-journal', 'obscure-tooltips', 'accents'],
  }
};

function byId(id: string): ModEntry {
  const mod = MODS.find(m => m.id === id);
  if (!mod) throw new Error(`showcase: unknown mod id "${id}"`);
  return mod;
}

const newest = [...MODS].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))[0];

export const showcaseMods = {
  newRelease: MODS.find(m => m.isNewRelease) ?? newest,
  featured: byId(SHOWCASE.featured),
  mainMod: byId(SHOWCASE.mainMod),
  trio: SHOWCASE.trio.mods.map(byId),
};
