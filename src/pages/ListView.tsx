import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePokemon } from '../context/PokemonContext';
import TypeBadge from '../components/TypeBadge';
import type { DetailNavState, Pokemon, SortKey, SortOrder } from '../types';
import { capitalize, formatHeight, formatWeight, padId } from '../utils';
import styles from './ListView.module.css';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'id', label: 'Pokédex number' },
  { value: 'name', label: 'Name' },
  { value: 'baseExperience', label: 'Base experience' },
  { value: 'height', label: 'Height' },
  { value: 'weight', label: 'Weight' },
];

function compare(a: Pokemon, b: Pokemon, key: SortKey): number {
  if (key === 'name') return a.name.localeCompare(b.name);
  return a[key] - b[key];
}

export default function ListView() {
  const { pokemon } = usePokemon();
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [order, setOrder] = useState<SortOrder>('asc');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? pokemon.filter((p) => p.name.includes(q) || String(p.id) === q.replace(/^#0*/, ''))
      : pokemon;
    const sorted = [...filtered].sort((a, b) => compare(a, b, sortKey) || a.id - b.id);
    return order === 'asc' ? sorted : sorted.reverse();
  }, [pokemon, query, sortKey, order]);

  const navState: DetailNavState = { ids: results.map((p) => p.id) };

  return (
    <section>
      <h1 className={styles.title}>Search Pokémon</h1>

      <div className={styles.controls}>
        <input
          type="search"
          className={styles.search}
          placeholder="Search by name or number…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search Pokémon"
          autoFocus
        />
        <label className={styles.sortLabel}>
          Sort by
          <select
            className={styles.select}
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.toggle} role="group" aria-label="Sort order">
          <button
            type="button"
            className={order === 'asc' ? styles.toggleActive : styles.toggleBtn}
            onClick={() => setOrder('asc')}
            aria-pressed={order === 'asc'}
          >
            ↑ Asc
          </button>
          <button
            type="button"
            className={order === 'desc' ? styles.toggleActive : styles.toggleBtn}
            onClick={() => setOrder('desc')}
            aria-pressed={order === 'desc'}
          >
            ↓ Desc
          </button>
        </div>
      </div>

      <p className={styles.count}>
        {results.length} result{results.length === 1 ? '' : 's'}
      </p>

      {results.length === 0 ? (
        <p className={styles.empty}>No Pokémon match “{query}”.</p>
      ) : (
        <ul className={styles.list}>
          {results.map((p) => (
            <li key={p.id}>
              <Link to={`/pokemon/${p.id}`} state={navState} className={styles.row}>
                <img src={p.sprite} alt="" className={styles.sprite} loading="lazy" />
                <span className={styles.id}>{padId(p.id)}</span>
                <span className={styles.name}>{capitalize(p.name)}</span>
                <span className={styles.types}>
                  {p.types.map((t) => (
                    <TypeBadge key={t} type={t} />
                  ))}
                </span>
                <span className={styles.meta}>
                  <span>EXP {p.baseExperience}</span>
                  <span>{formatHeight(p.height)}</span>
                  <span>{formatWeight(p.weight)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
