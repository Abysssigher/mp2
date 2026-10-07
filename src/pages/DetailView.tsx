import { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { usePokemon } from '../context/PokemonContext';
import TypeBadge from '../components/TypeBadge';
import type { DetailNavState } from '../types';
import { capitalize, formatHeight, formatWeight, padId } from '../utils';
import styles from './DetailView.module.css';

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

export default function DetailView() {
  const { id } = useParams<{ id: string }>();
  const { pokemon } = usePokemon();
  const location = useLocation();
  const navigate = useNavigate();

  const numericId = Number(id);
  const current = pokemon.find((p) => p.id === numericId);

  // Cycle through the list the user came from; fall back to the full Pokédex on direct URL visits.
  const state = location.state as DetailNavState | null;
  const ids = state?.ids?.includes(numericId) ? state.ids : pokemon.map((p) => p.id);
  const index = ids.indexOf(numericId);
  const prevId = ids[(index - 1 + ids.length) % ids.length];
  const nextId = ids[(index + 1) % ids.length];
  const navState: DetailNavState = { ids };

  // Keyboard arrows for prev / next.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigate(`/pokemon/${prevId}`, { state: navState });
      if (e.key === 'ArrowRight') navigate(`/pokemon/${nextId}`, { state: navState });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!current) {
    return (
      <div className={styles.notFound}>
        <p>No Pokémon with number {id} in this Pokédex.</p>
        <Link to="/list" className={styles.back}>
          ← Back to search
        </Link>
      </div>
    );
  }

  const total = current.stats.reduce((sum, s) => sum + s.value, 0);

  return (
    <article className={styles.wrapper}>
      <div className={styles.topBar}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <span className={styles.position}>
          {index + 1} / {ids.length}
        </span>
      </div>

      <div className={styles.card}>
        <Link
          to={`/pokemon/${prevId}`}
          state={navState}
          className={`${styles.arrow} ${styles.prev}`}
          aria-label="Previous Pokémon"
        >
          ‹
        </Link>

        <div className={styles.hero}>
          <div className={styles.imageWrap}>
            <img src={current.image} alt={capitalize(current.name)} className={styles.image} />
          </div>
          <p className={styles.id}>{padId(current.id)}</p>
          <h1 className={styles.name}>{capitalize(current.name)}</h1>
          <div className={styles.types}>
            {current.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>
        </div>

        <div className={styles.info}>
          <dl className={styles.facts}>
            <div>
              <dt>Height</dt>
              <dd>{formatHeight(current.height)}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{formatWeight(current.weight)}</dd>
            </div>
            <div>
              <dt>Base EXP</dt>
              <dd>{current.baseExperience}</dd>
            </div>
          </dl>

          <h2 className={styles.heading}>Abilities</h2>
          <ul className={styles.abilities}>
            {current.abilities.map((a) => (
              <li key={a}>{capitalize(a)}</li>
            ))}
          </ul>

          <h2 className={styles.heading}>Base stats</h2>
          <ul className={styles.stats}>
            {current.stats.map((s) => (
              <li key={s.name} className={styles.stat}>
                <span className={styles.statName}>{STAT_LABELS[s.name] ?? capitalize(s.name)}</span>
                <span className={styles.statValue}>{s.value}</span>
                <meter className={styles.meter} min={0} max={255} low={60} high={100} optimum={150} value={s.value} />
              </li>
            ))}
            <li className={`${styles.stat} ${styles.total}`}>
              <span className={styles.statName}>Total</span>
              <span className={styles.statValue}>{total}</span>
            </li>
          </ul>
        </div>

        <Link
          to={`/pokemon/${nextId}`}
          state={navState}
          className={`${styles.arrow} ${styles.next}`}
          aria-label="Next Pokémon"
        >
          ›
        </Link>
      </div>
      <p className={styles.hint}>Tip: use ← / → keys to browse.</p>
    </article>
  );
}
