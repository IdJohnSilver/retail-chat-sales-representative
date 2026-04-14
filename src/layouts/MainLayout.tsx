import { Outlet } from 'react-router-dom';

export function MainLayout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>FMTG Messenger</h1>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
