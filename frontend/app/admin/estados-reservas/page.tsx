'use client';

import { useMemo, useState } from 'react';
import styles from './page.module.css';

type EstadoFiltro = 'Todas' | 'Pendientes' | 'Aprobadas' | 'Finalizadas' | 'Canceladas';
type EstadoReserva = 'Pendiente' | 'Aprobada' | 'Finalizada' | 'Cancelada';

type Reserva = {
  id: string;
  cliente: string;
  cancha: string;
  fecha: string;
  hora: string;
  monto: string;
  estado: EstadoReserva;
};

const reservasIniciales: Reserva[] = [
  {
    id: 'R-1201',
    cliente: 'Andres Toro',
    cancha: 'Cancha 1 - Futbol 5',
    fecha: '2026-07-19',
    hora: '18:00 - 19:00',
    monto: '$120.000',
    estado: 'Pendiente',
  },
  {
    id: 'R-1202',
    cliente: 'Laura Mendez',
    cancha: 'Cancha 2 - Futbol 7',
    fecha: '2026-07-20',
    hora: '20:00 - 21:00',
    monto: '$165.000',
    estado: 'Aprobada',
  },
  {
    id: 'R-1203',
    cliente: 'Carlos Duran',
    cancha: 'Cancha 3 - Multiproposito',
    fecha: '2026-07-15',
    hora: '17:00 - 18:00',
    monto: '$98.000',
    estado: 'Pendiente',
  },
  {
    id: 'R-1204',
    cliente: 'Sofia Rojas',
    cancha: 'Cancha 1 - Futbol 5',
    fecha: '2026-07-22',
    hora: '19:00 - 20:00',
    monto: '$120.000',
    estado: 'Finalizada',
  },
  {
    id: 'R-1205',
    cliente: 'Camilo Perez',
    cancha: 'Cancha 2 - Futbol 7',
    fecha: '2026-07-23',
    hora: '21:00 - 22:00',
    monto: '$165.000',
    estado: 'Cancelada',
  },
];

const filtros: EstadoFiltro[] = ['Todas', 'Pendientes', 'Aprobadas', 'Finalizadas', 'Canceladas'];

const etiquetaEstado: Record<EstadoReserva, { label: string; className: string }> = {
  Pendiente: { label: 'Pendiente', className: styles.badgePendiente },
  Aprobada: { label: 'Aprobada', className: styles.badgeAprobada },
  Finalizada: { label: 'Finalizada', className: styles.badgeFinalizada },
  Cancelada: { label: 'Cancelada', className: styles.badgeCancelada },
};

const acciones = {
  Pendiente: ['Cambiar a Aprobada', 'Cambiar a Cancelada'],
  Aprobada: ['Cambiar a Finalizada', 'Cambiar a Cancelada'],
  Finalizada: ['Ver detalle'],
  Cancelada: ['Revisar motivo'],
} as const;

export default function AdminEstadosReservasPage() {
  const [filtroActivo, setFiltroActivo] = useState<EstadoFiltro>('Todas');

  const reservasFiltradas = useMemo(() => {
    if (filtroActivo === 'Todas') {
      return reservasIniciales;
    }

    if (filtroActivo === 'Pendientes') {
      return reservasIniciales.filter((reserva) => reserva.estado === 'Pendiente');
    }

    if (filtroActivo === 'Aprobadas') {
      return reservasIniciales.filter((reserva) => reserva.estado === 'Aprobada');
    }

    if (filtroActivo === 'Finalizadas') {
      return reservasIniciales.filter((reserva) => reserva.estado === 'Finalizada');
    }

    return reservasIniciales.filter((reserva) => reserva.estado === 'Cancelada');
  }, [filtroActivo]);

  const resumen = useMemo(
    () => ({
      pendientes: reservasIniciales.filter((reserva) => reserva.estado === 'Pendiente').length,
      aprobadas: reservasIniciales.filter((reserva) => reserva.estado === 'Aprobada').length,
      finalizadas: reservasIniciales.filter((reserva) => reserva.estado === 'Finalizada').length,
      canceladas: reservasIniciales.filter((reserva) => reserva.estado === 'Cancelada').length,
    }),
    [],
  );

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="estados-title">
        <div className={styles.hero__copy}>
          <p className={styles.eyebrow}>Panel administrativo</p>
          <h1 id="estados-title" className={styles.title}>
            Gestión de Estados de Reserva
          </h1>
          <p className={styles.description}>
            Un tablero visual limpio para monitorear y cambiar estados de reservas con una estética
            deportiva moderna, clara y alineada con la interfaz base de ReservaPlay.
          </p>
        </div>

        <div className={styles.summaryBoard} aria-label="Resumen rápido de estados">
          <article>
            <span>Pendientes</span>
            <strong>{resumen.pendientes}</strong>
          </article>
          <article>
            <span>Aprobadas</span>
            <strong>{resumen.aprobadas}</strong>
          </article>
          <article>
            <span>Finalizadas</span>
            <strong>{resumen.finalizadas}</strong>
          </article>
          <article>
            <span>Canceladas</span>
            <strong>{resumen.canceladas}</strong>
          </article>
        </div>
      </section>

      <section className={styles.panel} aria-labelledby="filtros-title">
        <div className={styles.panel__header}>
          <div>
            <p className={styles.panel__eyebrow}>Filtros rápidos</p>
            <h2 id="filtros-title" className={styles.panel__title}>
              Visualización por estado
            </h2>
          </div>
          <p className={styles.panel__note}>
            Mock data únicamente. No hay lógica de backend ni cambios en rutas globales.
          </p>
        </div>

        <div className={styles.filterBar} role="tablist" aria-label="Filtrar reservas por estado">
          {filtros.map((filtro) => {
            const isActive = filtro === filtroActivo;

            return (
              <button
                key={filtro}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.filterChip} ${isActive ? styles.filterChipActive : ''}`}
                onClick={() => setFiltroActivo(filtro)}
              >
                {filtro}
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.gridSection} aria-labelledby="board-title">
        <div className={styles.panel__header}>
          <div>
            <p className={styles.panel__eyebrow}>Tablero de reservas</p>
            <h2 id="board-title" className={styles.panel__title}>
              {filtroActivo === 'Todas' ? 'Todas las reservas' : `Reservas ${filtroActivo.toLowerCase()}`}
            </h2>
          </div>
          <div className={styles.legend} aria-label="Leyenda visual">
            <span className={styles.legendItem}><i className={styles.dotPendiente} /> Pendiente</span>
            <span className={styles.legendItem}><i className={styles.dotAprobada} /> Aprobada</span>
            <span className={styles.legendItem}><i className={styles.dotCancelada} /> Cancelada</span>
          </div>
        </div>

        <div className={styles.cardsGrid} role="list" aria-label="Listado de reservas">
          {reservasFiltradas.map((reserva) => {
            const meta = etiquetaEstado[reserva.estado];

            return (
              <article key={reserva.id} className={styles.reservaCard} role="listitem">
                <div className={styles.reservaCard__head}>
                  <div>
                    <p className={styles.reservaCard__id}>{reserva.id}</p>
                    <h3>{reserva.cliente}</h3>
                  </div>
                  <span className={`${styles.badge} ${meta.className}`}>{meta.label}</span>
                </div>

                <dl className={styles.reservaCard__meta}>
                  <div>
                    <dt>Cancha</dt>
                    <dd>{reserva.cancha}</dd>
                  </div>
                  <div>
                    <dt>Fecha</dt>
                    <dd>{reserva.fecha}</dd>
                  </div>
                  <div>
                    <dt>Horario</dt>
                    <dd>{reserva.hora}</dd>
                  </div>
                  <div>
                    <dt>Valor</dt>
                    <dd>{reserva.monto}</dd>
                  </div>
                </dl>

                <div className={styles.actionsBox}>
                  <label className={styles.actionsBox__label} htmlFor={`accion-${reserva.id}`}>
                    Acción rápida
                  </label>
                  <div className={styles.actionsBox__controls}>
                    <select id={`accion-${reserva.id}`} defaultValue={acciones[reserva.estado][0]}>
                      {acciones[reserva.estado].map((accion) => (
                        <option key={accion} value={accion}>
                          {accion}
                        </option>
                      ))}
                    </select>
                    <button type="button">Aplicar</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}