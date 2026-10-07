import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { fetchAllPokemon } from '../api/pokeapi';
import type { Pokemon } from '../types';

interface PokemonContextValue {
  pokemon: Pokemon[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

const PokemonContext = createContext<PokemonContextValue | null>(null);

export function PokemonProvider({ children }: { children: ReactNode }) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchAllPokemon()
      .then((data) => {
        if (!cancelled) setPokemon(data);
      })
      .catch(() => {
        if (!cancelled) setError('Could not reach PokéAPI. Check your connection and try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setAttempt((n) => n + 1);
  }, []);

  return (
    <PokemonContext.Provider value={{ pokemon, loading, error, retry }}>{children}</PokemonContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePokemon(): PokemonContextValue {
  const ctx = useContext(PokemonContext);
  if (!ctx) throw new Error('usePokemon must be used inside PokemonProvider');
  return ctx;
}
