import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import StatusGate from './components/StatusGate';
import ListView from './pages/ListView';
import GalleryView from './pages/GalleryView';
import DetailView from './pages/DetailView';
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <StatusGate>
          <Routes>
            <Route path="/" element={<Navigate to="/list" replace />} />
            <Route path="/list" element={<ListView />} />
            <Route path="/gallery" element={<GalleryView />} />
            <Route path="/pokemon/:id" element={<DetailView />} />
            <Route path="*" element={<Navigate to="/list" replace />} />
          </Routes>
        </StatusGate>
      </main>
      <footer className={styles.footer}>
        Data from <a href="https://pokeapi.co/">PokéAPI</a>. Pokémon © Nintendo / Game Freak.
      </footer>
    </div>
  );
}
