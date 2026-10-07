import styles from './TypeBadge.module.css';
import { capitalize } from '../utils';

export default function TypeBadge({ type }: { type: string }) {
  return <span className={`${styles.badge} ${styles[type] ?? ''}`}>{capitalize(type)}</span>;
}
