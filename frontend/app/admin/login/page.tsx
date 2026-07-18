'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../providers';

type LoginResponse = {
  access_token?: string;
  token?: string;
  message?: string;
};

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isReady } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace('/admin/canchas');
    }
  }, [isAuthenticated, isReady, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as LoginResponse;

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo iniciar sesión');
      }

      const token = data.access_token ?? data.token;
      if (!token) {
        throw new Error('El backend no devolvió un token válido');
      }

      login(token);

      const nextPath = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('next')
        : null;
      router.replace(nextPath && nextPath.startsWith('/admin/') ? nextPath : '/admin/canchas');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <p className="eyebrow">Acceso administrativo</p>
          <h1>Iniciar sesión</h1>
          <p>Ingresa con tu correo y contraseña para administrar ReservaPlay.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            <span>Correo electrónico</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@reservaplay.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            <span>Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <p className="login-error">{error}</p> : null}

          <button type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  );
}
