'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from "./login.module.css";
import { useAuth } from '../../providers';
import { loginAdministrador } from '../../../services/auth.service';
import { isAdminJwt } from '../../../lib/auth';

function getSafeAdminRedirect(nextParam: string | null): string {
  if (!nextParam) {
    return '/admin/dashboard';
  }

  if (!nextParam.startsWith('/admin') || nextParam.startsWith('//')) {
    return '/admin/dashboard';
  }

  return nextParam;
}


function AdminLoginForm() {
  const { isAuthenticated, isReady, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectPath = getSafeAdminRedirect(searchParams.get('next'));

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace('/admin/dashboard');
    }
  }, [isAuthenticated, isReady, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginAdministrador({ email, password });
      const token = data.access_token ?? data.token;

      if (!token) {
        throw new Error('El servidor no devolvió token de acceso');
      }

      if (!isAdminJwt(token)) {
        throw new Error('La cuenta autenticada no tiene rol de administrador.');
      }

      login(token);
      router.replace(redirectPath);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Error iniciando sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <p className={styles.eyebrow}>Acceso administrativo</p>
        <h2>Iniciar sesión</h2>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      <label className={styles.label} htmlFor="admin-email">
        Correo corporativo
      </label>
      <input
        id="admin-email"
        type="email"
        placeholder="admin@reservaplay.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <label className={styles.label} htmlFor="admin-password">
        Contraseña
      </label>
      <input
        id="admin-password"
        type="password"
        placeholder="Tu contraseña"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Validando acceso...' : 'Entrar al dashboard'}
      </button>

      <p className={styles.helper}>
        <Link href="/recuperar-password">¿Olvidaste tu contraseña?</Link>
      </p>

      <p className={styles.helper}>
        ¿Aún no tienes acceso? <Link href="/admin/registro">Solicita tu alta administrativa</Link>
      </p>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className={styles.container}>
      <section className={styles.panel}>
        <div className={styles.hero}>
          <span className={styles.kicker}>Aplicación deportiva</span>
          <h1>ReservaPlay Admin</h1>
          <p>
            Supervisa ocupación, disponibilidad y pagos manuales desde un solo panel.
          </p>
          <ul className={styles.metrics}>
            <li>Control de canchas</li>
            <li>Horarios operativos</li>
            <li>Reservas y pagos</li>
          </ul>
        </div>

        <Suspense fallback={<div className={styles.form}>Cargando formulario...</div>}>
          <AdminLoginForm />
        </Suspense>
      </section>
    </main>
  );
}