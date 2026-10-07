import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/list" className={styles.brand}>
          <span className={styles.ball} aria-hidden="true" />
          Pokédex Explorer
        </NavLink>
        <nav className={styles.nav}>
          <NavLink to="/list" className={linkClass}>
            Search
          </NavLink>
          <NavLink to="/gallery" className={linkClass}>
            Gallery
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
