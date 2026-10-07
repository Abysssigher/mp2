import axios from 'axios';
import type { Pokemon } from '../types';

const api = axios.create({ baseURL: 'https://pokeapi.co/api/v2', timeout: 15000 });

const POKEMON_COUNT = 151; // Generation I
const CACHE_KEY = 'pokedex-cache-v1';

// Shapes of the raw PokéAPI response (only the fields we use).
interface RawPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  types: { slot: number; type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    front_default: string | null;
    other?: { 'official-artwork'?: { front_default: string | null } };
  };
}

interface RawList {
  results: { name: string; url: string }[];
}

function toPokemon(raw: RawPokemon): Pokemon {
  const artwork = raw.sprites.other?.['official-artwork']?.front_default;
  return {
    id: raw.id,
    name: raw.name,
    types: [...raw.types].sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
    height: raw.height,
    weight: raw.weight,
    baseExperience: raw.base_experience ?? 0,
    abilities: raw.abilities.map((a) => a.ability.name),
    stats: raw.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
    image: artwork ?? raw.sprites.front_default ?? '',
    sprite: raw.sprites.front_default ?? artwork ?? '',
  };
}

function readCache(): Pokemon[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Pokemon[]) : null;
  } catch {
    return null;
  }
}

function writeCache(data: Pokemon[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable: caching is optional
  }
}

/** Fetches every Gen I Pokémon with details. Results are cached to respect PokéAPI fair use. */
export async function fetchAllPokemon(): Promise<Pokemon[]> {
  const cached = readCache();
  if (cached && cached.length === POKEMON_COUNT) return cached;

  const { data: list } = await api.get<RawList>('/pokemon', { params: { limit: POKEMON_COUNT } });
  const details = await Promise.all(
    list.results.map((entry) => api.get<RawPokemon>(`/pokemon/${entry.name}`).then((r) => toPokemon(r.data))),
  );
  details.sort((a, b) => a.id - b.id);
  writeCache(details);
  return details;
}
