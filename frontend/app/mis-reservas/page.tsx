'use client';

import { useMemo, useState } from 'react';
import { Bebas_Neue } from 'next/font/google';
import styles from './page.module.css';

type ViewFilter = 'Todas' | 'Proximas' | 'Jugadas' | 'Canceladas';
type ReservationState = 'Próximo' | 'Jugado' | 'Cancelado';

type Reservation = {
  id: string;
  cancha: string;
  fecha: string;
  hora: string;
  estado: ReservationState;
  monto: string;
  nota: string;
};

const sportsTitleFont = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
});

const reservasMock: Reservation[] = [
  {
    id: 'HR-4091',
    cancha: 'Cancha 1 - Futbol 5',
    fecha: 'Hoy · 20 Jul 2026',
    hora: '7:00 PM - 8:00 PM',
    estado: 'Próximo',
    monto: '$120.000',
    nota: 'Reserva vigente lista para gestionarse por el cliente.',
  },
  {
    id: 'HR-4088',
    cancha: 'Cancha 2 - Futbol 7',
    fecha: '18 Jul 2026',
    hora: '8:00 PM - 9:00 PM',
    estado: 'Jugado',
    monto: '$165.000',
    nota: 'Partido disputado y cerrado correctamente en el historial.',
  },
  {
    id: 'HR-4082',
    cancha: 'Cancha 3 - Multipropósito',
    fecha: '16 Jul 2026',
    hora: '6:00 PM - 7:00 PM',
    estado: 'Cancelado',
    monto: '$98.000',
    nota: 'Cancelada previamente por cambio de agenda del cliente.',
  },
  {
    id: 'HR-4094',
    cancha: 'Cancha 1 - Futbol 5',
    fecha: '22 Jul 2026',
    hora: '9:00 PM - 10:00 PM',
    estado: 'Próximo',
    monto: '$120.000',
    nota: 'Reserva futura confirmada en cola de uso del cliente.',
  },
  {
    id: 'HR-4076',
    cancha: 'Cancha 2 - Futbol 7',
    fecha: '12 Jul 2026',
    hora: '5:00 PM - 6:00 PM',
    estado: 'Jugado',
    monto: '$165.000',
    nota: 'Registro antiguo conservado como referencia de uso.',
  },
];

const filters: ViewFilter[] = ['Todas', 'Proximas', 'Jugadas', 'Canceladas'];

const stateMeta: Record<ReservationState, { label: string; className: string; dotClassName: string }> = {
  Próximo: { label: 'Próximo', className: styles.badgeNext, dotClassName: styles.dotNext },
  Jugado: { label: 'Jugado', className: styles.badgePlayed, dotClassName: styles.dotPlayed },
  Cancelado: { label: 'Cancelado', className: styles.badgeCancelled, dotClassName: styles.dotCancelled },
};

export default function MisReservasPage() {
  const [filtroActivo, setFiltroActivo] = useState<ViewFilter>('Todas');
  const [reservaActiva, setReservaActiva] = useState<Reservation | null>(null);

  const reservasVisibles = useMemo(() => {
    switch (filtroActivo) {
      case 'Proximas':
        return reservasMock.filter((reserva) => reserva.estado === 'Próximo');
      case 'Jugadas':
        return reservasMock.filter((reserva) => reserva.estado === 'Jugado');
      case 'Canceladas':
        return reservasMock.filter((reserva) => reserva.estado === 'Cancelado');
      default:
        return reservasMock;
    }
  }, [filtroActivo]);

  const resumen = useMemo(
    () => ({
      proximas: reservasMock.filter((reserva) => reserva.estado === 'Próximo').length,
      jugadas: reservasMock.filter((reserva) => reserva.estado === 'Jugado').length,
      canceladas: reservasMock.filter((reserva) => reserva.estado === 'Cancelado').length,
    }),
    [],
  );

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="historial-title">
        <div className={styles.hero__copy}>
          <p className={styles.eyebrow}>Mi cuenta</p>
          <h1 id="historial-title" className={styles.title}>
            Historial y Cancelación
          </h1>
          <p className={styles.description}>
            Una vista limpia y deportiva para revisar reservas pasadas y futuras, con acceso visual
            rápido a cancelaciones simuladas y estados bien destacados.
          </p>
        </div>

        <div className={styles.summary} aria-label="Resumen de reservas del cliente">
          <article>
            <span>Próximas</span>
            <strong>{resumen.proximas}</strong>
          </article>
          <article>
            <span>Jugadas</span>
            <strong>{resumen.jugadas}</strong>
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
              <i className={styles.dotNext} /> Próximo
            </span>
            <span className={styles.legendItem}>
              <i className={styles.dotPlayed} /> Jugado
            </span>
            <span className={styles.legendItem}>
              <i className={styles.dotCancelled} /> Cancelado
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

      <section className={styles.timelineSection} aria-labelledby="timeline-title">
        <div className={styles.panel__header}>
          <div>
            <p className={styles.panel__eyebrow}>Timeline</p>
            <h2 id="timeline-title" className={styles.panel__title}>
              Reservas del cliente
            </h2>
          </div>
          <p className={styles.panel__note}>
            Mock data únicamente. La cancelación abre un modal visual de confirmación.
          </p>
        </div>

        <div className={styles.timelineList} role="list" aria-label="Reservas del cliente">
          {reservasVisibles.map((reserva) => {
            const meta = stateMeta[reserva.estado];
            const allowCancel = reserva.estado === 'Próximo';

            return (
              <article key={reserva.id} className={styles.reservationCard} role="listitem">
                <div className={styles.reservationCard__rail} aria-hidden="true">
                  <span className={styles.reservationCard__dot} />
                  <span className={styles.reservationCard__line} />
                </div>

                <div className={styles.reservationCard__content}>
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
                        Cancelar Reserva
                      </button>
                    ) : (
                      <span className={styles.lockedNote}>
                        Esta reserva ya fue {reserva.estado === 'Cancelado' ? 'cancelada previamente' : 'cerrada'}.
                      </span>
                    )}
                    <button type="button" className={styles.secondaryButton}>
                      Ver detalle
                    </button>
                  </div>
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
                  Cancelar Reserva
                </h3>
              </div>
              <button type="button" className={styles.modal__close} onClick={() => setReservaActiva(null)}>
                ×
              </button>
            </div>

            <p className={styles.modal__text}>
              Esta es una confirmación visual simulada para la reserva {reservaActiva.id}. El cliente
              podría confirmar la cancelación de la cancha {reservaActiva.cancha} en el horario {reservaActiva.hora}.
            </p>

            <div className={styles.modal__summary}>
              <span>La reserva volverá a liberar el horario</span>
              <strong>Acción de ejemplo sin lógica real</strong>
            </div>

            <div className={styles.modal__actions}>
              <button type="button" className={styles.secondaryButton} onClick={() => setReservaActiva(null)}>
                Mantener Reserva
              </button>
              <button type="button" className={styles.cancelButton} onClick={() => setReservaActiva(null)}>
                Confirmar Cancelación
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}