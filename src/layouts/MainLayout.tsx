import { Outlet } from 'react-router-dom';
import { BackButton } from '../components/BackButton';

export function MainLayout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <BackButton />
        <h1>FMTG Messenger</h1>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
