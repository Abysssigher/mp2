export interface Stat {
  name: string;
  value: number;
}

export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  height: number; // decimetres
  weight: number; // hectograms
  baseExperience: number;
  abilities: string[];
  stats: Stat[];
  image: string;
  sprite: string;
}

export type SortKey = 'id' | 'name' | 'baseExperience' | 'height' | 'weight';
export type SortOrder = 'asc' | 'desc';

/** Router state passed to the detail view so prev/next follows the list the user came from. */
export interface DetailNavState {
  ids: number[];
}
