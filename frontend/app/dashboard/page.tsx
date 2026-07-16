'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [token, setToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('reservaplay_token');
    if (!savedToken) {
      router.replace('/');
      return;
    }
    setToken(savedToken);
  }, [router]);

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <h1>Bienvenido a ReservaPlay</h1>
          <p>Has iniciado sesión correctamente.</p>
        </div>

        <div className="login-form">
          <p>
            Token guardado en <code>localStorage</code> para futuras llamadas a la API.
          </p>
          <pre style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', overflowX: 'auto' }}>
            {token}
          </pre>
        </div>
      </section>
    </main>
  );
}
