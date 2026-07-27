'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../providers';
import { obtenerMisReservas } from '../../../services/reservas.service';
import styles from './dashboard.module.css';

type ReservaDashboard = {
  id?: string;
  estado?: string;
};

const estadosBase = ['Pendiente', 'Confirmada', 'Pagada', 'Finalizada', 'Cancelada'] as const;

function normalizarEstado(estado?: string): (typeof estadosBase)[number] {
  const valor = (estado ?? 'Pendiente').toLowerCase();

  if (valor.includes('cancel')) {
    return 'Cancelada';
  }

  if (valor.includes('final')) {
    return 'Finalizada';
  }

  if (valor.includes('pag')) {
    return 'Pagada';
  }

  if (valor.includes('confirm')) {
    return 'Confirmada';
  }

  return 'Pendiente';
}

export default function ClienteDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isReady, logout } = useAuth();
  const [reservas, setReservas] = useState<ReservaDashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!isAuthenticated) {
      router.replace('/login?next=/cliente/dashboard');
    }
  }, [isAuthenticated, isReady, router]);

  useEffect(() => {
    if (!isReady || !isAuthenticated) {
      return;
    }

    let activo = true;

    const cargarReservas = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await obtenerMisReservas();

        if (!activo) {
          return;
        }

        setReservas(Array.isArray(data) ? (data as ReservaDashboard[]) : []);
      } catch (dashboardError) {
        if (!activo) {
          return;
        }

        setError(dashboardError instanceof Error ? dashboardError.message : 'No se pudieron cargar tus reservas.');
        setReservas([]);
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    };

    void cargarReservas();

    return () => {
      activo = false;
    };
  }, [isAuthenticated, isReady]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const estadoReservas = useMemo(() => {
    const conteo = {
      Pendiente: 0,
      Confirmada: 0,
      Pagada: 0,
      Finalizada: 0,
      Cancelada: 0,
    };

    reservas.forEach((reserva) => {
      const estado = normalizarEstado(reserva.estado);
      conteo[estado] += 1;
    });

    return conteo;
  }, [reservas]);

  if (!isReady) {
    return (
      <section className={styles.container}>
        <p className={styles.loading}>Verificando sesión...</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className={styles.container}>
        <p className={styles.loading}>Redirigiendo al inicio de sesión...</p>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Panel del cliente</p>
          <h2>Bienvenido a ReservaPlay</h2>
          <p className={styles.lead}>
            Gestiona tus reservas, consulta su estado y accede rápido a las acciones principales.
          </p>
        </div>
        <div className={styles.heroActions}>
          <div className={styles.badge}>{loading ? 'Actualizando...' : 'Cuenta activa'}</div>
          <button type="button" className={styles.logoutButton} onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      <section className={styles.cards}>
        <article className={styles.card} data-accent="blue">
          <span>Total de reservas</span>
          <strong>{reservas.length}</strong>
        </article>

        <article className={styles.card} data-accent="orange">
          <span>Reservas pendientes</span>
          <strong>{estadoReservas.Pendiente}</strong>
        </article>

        <article className={styles.card} data-accent="green">
          <span>Reservas confirmadas/pagadas</span>
          <strong>{estadoReservas.Confirmada + estadoReservas.Pagada}</strong>
        </article>
      </section>

      <section className={styles.grid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Acciones rápidas</h3>
            <p>Completa tu flujo en dos clics.</p>
          </div>

          <div className={styles.actionList}>
            <Link href="/reservar" className={styles.actionCard}>
              <strong>Reservar cancha</strong>
              <span>Selecciona cancha, horario y fecha disponible.</span>
            </Link>

            <Link href="/mis-reservas" className={styles.actionCard}>
              <strong>Mis reservas</strong>
              <span>Consulta el detalle y seguimiento de cada reserva.</span>
            </Link>
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Estado de reservas</h3>
            <p>Resumen por estado actual.</p>
          </div>

          <ul className={styles.statusList}>
            <li>
              <span>Pendiente</span>
              <strong>{estadoReservas.Pendiente}</strong>
            </li>
            <li>
              <span>Confirmada</span>
              <strong>{estadoReservas.Confirmada}</strong>
            </li>
            <li>
              <span>Pagada</span>
              <strong>{estadoReservas.Pagada}</strong>
            </li>
            <li>
              <span>Finalizada</span>
              <strong>{estadoReservas.Finalizada}</strong>
            </li>
            <li>
              <span>Cancelada</span>
              <strong>{estadoReservas.Cancelada}</strong>
            </li>
          </ul>
        </article>
      </section>
    </section>
  );
}
