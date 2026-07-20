'use client';

import { useMemo, useState } from 'react';
import { Bebas_Neue } from 'next/font/google';
import styles from './page.module.css';

type ViewFilter = 'Todas' | 'Pendientes' | 'Aprobadas' | 'Canceladas';
type ReservationStatus = 'Pendiente' | 'Aprobada' | 'Cancelada';

type Reservation = {
  id: string;
  cancha: string;
  fecha: string;
  hora: string;
  estado: ReservationStatus;
  monto: string;
  nota: string;
};

const sportsTitleFont = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
});

const reservasMock: Reservation[] = [
  {
    id: 'RS-4101',
    cancha: 'Cancha 1 - Futbol 5',
    fecha: 'mar, 21 jul 2026',
    hora: '19:00 - 20:00',
    estado: 'Pendiente',
    monto: '$120.000',
    nota: 'Reserva recién creada, pendiente de confirmación interna.',
  },
  {
    id: 'RS-4098',
    cancha: 'Cancha 2 - Futbol 7',
    fecha: 'lun, 20 jul 2026',
    hora: '20:00 - 21:00',
    estado: 'Aprobada',
    monto: '$165.000',
    nota: 'Reserva aprobada y lista para jugar.',
  },
  {
    id: 'RS-4094',
    cancha: 'Cancha 3 - Multipropósito',
    fecha: 'dom, 19 jul 2026',
    hora: '18:00 - 19:00',
    estado: 'Cancelada',
    monto: '$98.000',
    nota: 'Cancelada previamente por cambio de agenda del cliente.',
  },
  {
    id: 'RS-4089',
    cancha: 'Cancha 1 - Futbol 5',
    fecha: 'vie, 17 jul 2026',
    hora: '17:00 - 18:00',
    estado: 'Aprobada',
    monto: '$120.000',
    nota: 'Reserva aprobada con horario activo y confirmado.',
  },
  {
    id: 'RS-4083',
    cancha: 'Cancha 2 - Futbol 7',
    fecha: 'jue, 16 jul 2026',
    hora: '21:00 - 22:00',
    estado: 'Cancelada',
    monto: '$165.000',
    nota: 'Cancelada después de un ajuste en la agenda del equipo.',
  },
];

const filters: ViewFilter[] = ['Todas', 'Pendientes', 'Aprobadas', 'Canceladas'];

const stateMeta: Record<ReservationStatus, { label: string; className: string; dotClassName: string }> = {
  Pendiente: { label: 'Pendiente', className: styles.badgePending, dotClassName: styles.dotPending },
  Aprobada: { label: 'Aprobada', className: styles.badgeApproved, dotClassName: styles.dotApproved },
  Cancelada: { label: 'Cancelada', className: styles.badgeCancelled, dotClassName: styles.dotCancelled },
};

export default function MisReservasPage() {
  const [filtroActivo, setFiltroActivo] = useState<ViewFilter>('Todas');
  const [reservaActiva, setReservaActiva] = useState<Reservation | null>(null);
  const [reservas, setReservas] = useState<Reservation[]>(reservasMock);

  const reservasVisibles = useMemo(() => {
    switch (filtroActivo) {
      case 'Pendientes':
        return reservas.filter((reserva) => reserva.estado === 'Pendiente');
      case 'Aprobadas':
        return reservas.filter((reserva) => reserva.estado === 'Aprobada');
      case 'Canceladas':
        return reservas.filter((reserva) => reserva.estado === 'Cancelada');
      default:
        return reservas;
    }
  }, [filtroActivo, reservas]);

  const resumen = useMemo(
    () => ({
      pendientes: reservas.filter((reserva) => reserva.estado === 'Pendiente').length,
      aprobadas: reservas.filter((reserva) => reserva.estado === 'Aprobada').length,
      canceladas: reservas.filter((reserva) => reserva.estado === 'Cancelada').length,
    }),
    [reservas],
  );

  const cancelarReserva = () => {
    if (!reservaActiva) {
      return;
    }

    setReservas((actual) =>
      actual.map((reserva) =>
        reserva.id === reservaActiva.id ? { ...reserva, estado: 'Cancelada' } : reserva,
      ),
    );
    setReservaActiva(null);
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="reservas-title">
        <div className={styles.hero__copy}>
          <p className={styles.eyebrow}>Mi cuenta</p>
          <h1 id="reservas-title" className={`${styles.title} ${sportsTitleFont.className}`}>
            Mis Reservas
          </h1>
          <p className={styles.description}>
            Revisa el estado actual de tus reservas, filtra por estado y gestiona las que aún estén
            activas desde una interfaz visual limpia.
          </p>
        </div>

        <div className={styles.summary} aria-label="Resumen de reservas del cliente">
          <article>
            <span>Pendientes</span>
            <strong>{resumen.pendientes}</strong>
          </article>
          <article>
            <span>Aprobadas</span>
            <strong>{resumen.aprobadas}</strong>
          </article>
          <article>
            <span>Canceladas</span>
            <strong>{resumen.canceladas}</strong>
          </article>
        </div>
      </section>

      <section className={styles.panel} aria-labelledby="filters-title">
        <div className={styles.panel__header}>
          <div>
            <p className={styles.panel__eyebrow}>Filtros rápidos</p>
            <h2 id="filters-title" className={styles.panel__title}>
              Ver reservas por estado
            </h2>
          </div>
          <div className={styles.legend} aria-label="Leyenda de estados">
            <span className={styles.legendItem}>
              <i className={styles.dotPending} /> Pendiente
            </span>
            <span className={styles.legendItem}>
              <i className={styles.dotApproved} /> Aprobada
            </span>
            <span className={styles.legendItem}>
              <i className={styles.dotCancelled} /> Cancelada
            </span>
          </div>
        </div>

        <div className={styles.filterBar} role="tablist" aria-label="Filtrar historial">
          {filters.map((filter) => {
            const isActive = filter === filtroActivo;

            return (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.filterChip} ${isActive ? styles.filterChipActive : ''}`}
                onClick={() => setFiltroActivo(filter)}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.listSection} aria-labelledby="list-title">
        <div className={styles.panel__header}>
          <div>
            <p className={styles.panel__eyebrow}>Listado</p>
            <h2 id="list-title" className={styles.panel__title}>
              Reservas del cliente
            </h2>
          </div>
          <p className={styles.panel__note}>
            Las reservas aprobadas y pendientes mantienen la acción de cancelación visual.
          </p>
        </div>

        <div className={styles.reservationList} role="list" aria-label="Reservas del cliente">
          {reservasVisibles.map((reserva) => {
            const meta = stateMeta[reserva.estado];
            const allowCancel = reserva.estado !== 'Cancelada';

            return (
              <article key={reserva.id} className={styles.reservationCard} role="listitem">
                <div className={styles.reservationCard__head}>
                  <div>
                    <p className={styles.reservationCard__id}>{reserva.id}</p>
                    <h3>{reserva.cancha}</h3>
                  </div>
                  <span className={`${styles.badge} ${meta.className}`}>
                    <span className={`${styles.badge__dot} ${meta.dotClassName}`} />
                    {meta.label}
                  </span>
                </div>

                <dl className={styles.reservationCard__meta}>
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
                  <div>
                    <dt>Nota</dt>
                    <dd>{reserva.nota}</dd>
                  </div>
                </dl>

                <div className={styles.reservationCard__actions}>
                  {allowCancel ? (
                    <button type="button" className={styles.cancelButton} onClick={() => setReservaActiva(reserva)}>
                      Cancelar reserva
                    </button>
                  ) : (
                    <span className={styles.lockedNote}>Esta reserva ya está cancelada.</span>
                  )}
                  <button type="button" className={styles.secondaryButton}>
                    Ver detalle
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {reservaActiva ? (
        <div className={styles.modalBackdrop} role="presentation" onClick={() => setReservaActiva(null)}>
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modal__header}>
              <div>
                <p className={styles.modal__eyebrow}>Confirmación</p>
                <h3 id="cancel-title" className={sportsTitleFont.className}>
                  Cancelar reserva
                </h3>
              </div>
              <button type="button" className={styles.modal__close} onClick={() => setReservaActiva(null)}>
                ×
              </button>
            </div>

            <p className={styles.modal__text}>
              Esta es una confirmación visual simulada para la reserva {reservaActiva.id}. La acción
              quedará reflejada como cancelada en el listado del cliente.
            </p>

            <div className={styles.modal__summary}>
              <span>La reserva liberará el horario</span>
              <strong>Acción simulada sin backend</strong>
            </div>

            <div className={styles.modal__actions}>
              <button type="button" className={styles.secondaryButton} onClick={() => setReservaActiva(null)}>
                Mantener reserva
              </button>
              <button type="button" className={styles.cancelButton} onClick={cancelarReserva}>
                Confirmar cancelación
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
