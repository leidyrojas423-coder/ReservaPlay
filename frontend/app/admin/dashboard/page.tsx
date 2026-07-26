'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import styles from './dashboard.module.css';
import {
  listarCanchas,
  listarHorarios,
  listarReservasAdmin,
  obtenerAdminDashboard,
  type AdminReserva,
} from '../../../services/admin.service';

const quickActions = [
  { href: '/admin/canchas', label: 'Gestionar canchas', detail: 'Alta, edición y cambio a mantenimiento.' },
  { href: '/admin/horarios', label: 'Gestionar horarios', detail: 'Bloques operativos por cancha.' },
  { href: '/admin/reservas', label: 'Gestionar reservas', detail: 'Confirmación, pago manual y cancelación.' },
];

function normalizarEstado(estado?: string) {
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

export default function DashboardPage() {
  const [canchas, setCanchas] = useState(0);
  const [canchasMantenimiento, setCanchasMantenimiento] = useState(0);
  const [horarios, setHorarios] = useState(0);
  const [reservas, setReservas] = useState<AdminReserva[]>([]);
  const [estadoApi, setEstadoApi] = useState('Sin verificar');
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      try {
        const [dashboard, canchasData, horariosData, reservasData] = await Promise.all([
          obtenerAdminDashboard(),
          listarCanchas(),
          listarHorarios(),
          listarReservasAdmin().catch(() => []),
        ]);

        if (!activo) {
          return;
        }

        setEstadoApi(dashboard.message ?? 'Panel disponible');
        setCanchas(canchasData.length);
        setCanchasMantenimiento(canchasData.filter((cancha) => cancha.activo === false).length);
        setHorarios(horariosData.length);
        setReservas(reservasData);
      } catch (dashboardError) {
        if (!activo) {
          return;
        }

        setError(dashboardError instanceof Error ? dashboardError.message : 'No se pudo cargar el dashboard.');
      }
    };

    void cargar();

    return () => {
      activo = false;
    };
  }, []);

  const resumen = useMemo(() => {
    const conteo = reservas.reduce(
      (acc, reserva) => {
        const estado = normalizarEstado(reserva.estado);
        acc[estado] += 1;
        return acc;
      },
      {
        Pendiente: 0,
        Confirmada: 0,
        Pagada: 0,
        Finalizada: 0,
        Cancelada: 0,
      } as Record<string, number>,
    );

    return [
      { titulo: 'Canchas registradas', valor: canchas, accent: 'green' },
      { titulo: 'Horarios activos', valor: horarios, accent: 'blue' },
      { titulo: 'Reservas pendientes', valor: conteo.Pendiente, accent: 'orange' },
      { titulo: 'Pagos confirmados', valor: conteo.Pagada + conteo.Confirmada, accent: 'dark' },
    ];
  }, [canchas, horarios, reservas]);

  return (
    <section className={styles.container}>
      <div className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Dashboard administrativo</p>
          <h2>Operación diaria de la sede deportiva</h2>
          <p className={styles.lead}>
            Visualiza la carga operativa del día y entra directo a las tareas críticas del administrador.
          </p>
        </div>
        <div className={styles.badge}>{estadoApi}</div>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      <section className={styles.cards}>
        {resumen.map((item) => (
          <article key={item.titulo} className={styles.card} data-accent={item.accent}>
            <span>{item.titulo}</span>
            <strong>{item.valor}</strong>
          </article>
        ))}
      </section>

      <section className={styles.grid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Accesos rápidos</h3>
            <p>Rutas principales del módulo administrador.</p>
          </div>

          <div className={styles.actionList}>
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href} className={styles.actionCard}>
                <strong>{action.label}</strong>
                <span>{action.detail}</span>
              </Link>
            ))}
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Resumen operativo</h3>
            <p>Estado agregado a partir de los endpoints disponibles hoy.</p>
          </div>

          <ul className={styles.statusList}>
            <li>Canchas en mantenimiento: {canchasMantenimiento}</li>
            <li>Reservas canceladas: {reservas.filter((reserva) => normalizarEstado(reserva.estado) === 'Cancelada').length}</li>
            <li>Reservas finalizadas: {reservas.filter((reserva) => normalizarEstado(reserva.estado) === 'Finalizada').length}</li>
            <li>Fuente de reservas: endpoint administrativo si existe, o fallback al listado disponible.</li>
          </ul>
        </article>
      </section>
    </section>
  );
}