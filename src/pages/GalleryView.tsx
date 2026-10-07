import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePokemon } from '../context/PokemonContext';
import TypeBadge from '../components/TypeBadge';
import type { DetailNavState } from '../types';
import { capitalize, padId } from '../utils';
import styles from './GalleryView.module.css';
import badgeStyles from '../components/TypeBadge.module.css';

type MatchMode = 'any' | 'all';

export default function GalleryView() {
  const { pokemon } = usePokemon();
  const [selected, setSelected] = useState<string[]>([]);
  const [mode, setMode] = useState<MatchMode>('any');

  const allTypes = useMemo(
    () => Array.from(new Set(pokemon.flatMap((p) => p.types))).sort(),
    [pokemon],
  );

  const results = useMemo(() => {
    if (selected.length === 0) return pokemon;
    return pokemon.filter((p) =>
      mode === 'any' ? selected.some((t) => p.types.includes(t)) : selected.every((t) => p.types.includes(t)),
    );
  }, [pokemon, selected, mode]);

  const toggleType = (type: string) =>
    setSelected((cur) => (cur.includes(type) ? cur.filter((t) => t !== type) : [...cur, type]));

  const navState: DetailNavState = { ids: results.map((p) => p.id) };

  return (
    <section>
      <h1 className={styles.title}>Gallery</h1>

      <div className={styles.filters}>
        <div className={styles.filterHeader}>
          <span className={styles.label}>Filter by type</span>
          <div className={styles.mode} role="group" aria-label="Match mode">
            <button
              type="button"
              className={mode === 'any' ? styles.modeActive : styles.modeBtn}
              onClick={() => setMode('any')}
              aria-pressed={mode === 'any'}
            >
              Match any
            </button>
            <button
              type="button"
              className={mode === 'all' ? styles.modeActive : styles.modeBtn}
              onClick={() => setMode('all')}
              aria-pressed={mode === 'all'}
            >
              Match all
            </button>
          </div>
          {selected.length > 0 && (
            <button type="button" className={styles.clear} onClick={() => setSelected([])}>
              Clear filters
            </button>
          )}
        </div>
        <div className={styles.chips}>
          {allTypes.map((type) => {
            const on = selected.includes(type);
            return (
              <button
                key={type}
                type="button"
                className={`${styles.chip} ${on ? `${badgeStyles[type] ?? ''} ${styles.chipOn}` : ''}`}
                onClick={() => toggleType(type)}
                aria-pressed={on}
              >
                {capitalize(type)}
              </button>
            );
          })}
        </div>
      </div>

      <p className={styles.count}>
        Showing {results.length} of {pokemon.length}
      </p>

      {results.length === 0 ? (
        <p className={styles.empty}>No Pokémon have all of those types. Try “Match any”.</p>
      ) : (
        <ul className={styles.grid}>
          {results.map((p) => (
            <li key={p.id}>
              <Link to={`/pokemon/${p.id}`} state={navState} className={styles.card}>
                <div className={styles.imageWrap}>
                  <img src={p.image} alt={capitalize(p.name)} className={styles.image} loading="lazy" />
                </div>
                <span className={styles.id}>{padId(p.id)}</span>
                <span className={styles.name}>{capitalize(p.name)}</span>
                <span className={styles.types}>
                  {p.types.map((t) => (
                    <TypeBadge key={t} type={t} />
                  ))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
