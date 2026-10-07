import type { ReactNode } from 'react';
import { usePokemon } from '../context/PokemonContext';
import styles from './StatusGate.module.css';

/** Shows loading / error states until Pokémon data is ready. */
export default function StatusGate({ children }: { children: ReactNode }) {
  const { loading, error, retry } = usePokemon();

  if (loading) {
    return (
      <div className={styles.status}>
        <div className={styles.spinner} aria-hidden="true" />
        <p>Catching Pokémon…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.status}>
        <p className={styles.error}>{error}</p>
        <button type="button" className={styles.retry} onClick={retry}>
          Try again
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
