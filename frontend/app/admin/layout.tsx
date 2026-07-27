'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import AdminSessionBar from '../components/admin-session-bar';

interface AdminLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/canchas', label: 'Canchas' },
  { href: '/admin/horarios', label: 'Horarios' },
  { href: '/admin/reservas', label: 'Reservas' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const isAuthRoute = pathname === '/admin/login' || pathname === '/admin/registro';

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="app-shell">
      <header className="page-header">
        <div className="page-header__content">
          <div>
            <p className="eyebrow">Centro de operaciones</p>
            <h1>ReservaPlay Admin</h1>
          </div>
          <AdminSessionBar />
        </div>
      </header>

      <div className="page-body">
        <aside className="sidebar">
          <div>
            <div className="brand-name">ReservaPlay</div>
            <p style={{ margin: '10px 0 0', color: '#94a3b8', lineHeight: 1.5 }}>
              Control administrativo de canchas, horarios y reservas.
            </p>
          </div>

          <nav aria-label="Navegación del administrador">
            <ul className="nav-list">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      style={isActive ? { background: '#22c55e', color: '#052e16', fontWeight: 700 } : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="page-main">{children}</main>
      </div>

      <footer className="page-footer">
        <p>Panel administrativo para la operación diaria de ReservaPlay.</p>
      </footer>
    </div>
  );
}