import type { Metadata } from 'next';
import './globals.css';
import AdminSessionBar from './components/admin-session-bar';
import { AuthProvider } from './providers';

export const metadata: Metadata = {
  title: 'ReservaPlay',
  description: 'ReservaPlay estructura principal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <div className="app-shell">
            <header className="page-header">
              <div className="page-header__content">
                <div>
                  <p className="eyebrow">Panel principal</p>
                  <h1>Bienvenido a ReservaPlay</h1>
                </div>
                <AdminSessionBar />
              </div>
            </header>

            <div className="page-body">
              <aside className="sidebar" aria-label="Navegación principal">
                <div className="brand">
                  <span className="brand-name">ReservaPlay</span>
                </div>
                <nav>
                  <ul className="nav-list">
                    <li><a href="#">Inicio</a></li>
                    <li><a href="#">Reservas</a></li>
                    <li><a href="#">Canchas</a></li>
                    <li><a href="#">Clientes</a></li>
                    <li><a href="#">Administradores</a></li>
                  </ul>
                </nav>
              </aside>

              <main className="page-main">{children}</main>
            </div>

            <footer className="page-footer">
              <p>© {new Date().getFullYear()} ReservaPlay. Todos los derechos reservados.</p>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
