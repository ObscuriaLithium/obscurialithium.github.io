export interface HomeBlockArt {
  background?: string;
  prop?: string;
  logo?: string;
}

const backgrounds = '/assets/img/home/backgrounds';
const props = '/assets/img/home/props';

export const HOME_ART = {
  hero: {
    logo: `${props}/hero.webp`,
  },
  newRelease: {
    background: `${backgrounds}/new-release.webp`,
    prop: `${props}/new-release.webp`,
  },
} satisfies Record<string, HomeBlockArt>;
