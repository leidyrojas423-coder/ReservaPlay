'use client';

import { useMemo } from 'react';

export default function AdminSessionBar() {
  const isActive = useMemo(() => true, []);

  return (
    <div className="admin-session-bar">
      <span className={`admin-session-bar__dot ${isActive ? 'is-active' : 'is-inactive'}`} />
      <span className="admin-session-bar__state">
        {isActive ? 'Sesión activa' : 'Sesión inactiva'}
      </span>
      <button type="button" className="admin-session-bar__button">
        Salir
      </button>
    </div>
  );
}
