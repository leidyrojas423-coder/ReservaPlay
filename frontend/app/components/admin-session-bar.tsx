'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../providers';

export default function AdminSessionBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isReady, logout } = useAuth();

  const isAdminArea = Boolean(pathname?.startsWith('/admin')) && pathname !== '/admin/login';

  if (!isAdminArea || !isReady) {
    return null;
  }

  return (
    <div className="admin-session-bar" role="status" aria-live="polite">
      <div className="admin-session-bar__state">
        <span className={`admin-session-bar__dot ${isAuthenticated ? 'is-active' : 'is-inactive'}`} />
        <span>{isAuthenticated ? 'Sesión activa' : 'Sesión no detectada'}</span>
      </div>

      <button
        type="button"
        className="admin-session-bar__button"
        onClick={() => {
          logout();
          router.replace('/admin/login');
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
