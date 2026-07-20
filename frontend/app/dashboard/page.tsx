'use client';

import { useMemo, useState } from 'react';
import { Bebas_Neue } from 'next/font/google';
import styles from './page.module.css';

type CanchaEstado = 'Disponible' | 'Ocupada' | 'Mantenimiento';
type SlotEstado = 'Disponible' | 'Reservado' | 'Ocupado';

type HorarioSlot = {
  id: string;
  hora: string;
  estado: SlotEstado;
};

type Cancha = {
  id: string;
  nombre: string;
  categoria: string;
  ubicacion: string;
  estado: CanchaEstado;
  capacidad: number;
  precio: string;
  descripcion: string;
  horarios: HorarioSlot[];
};

type ReservaMock = {
  id: string;
  cancha: string;
  fecha: string;
  hora: string;
  estado: 'Pendiente';
  monto: string;
};

const sportsTitleFont = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
});

const canchasIniciales: Cancha[] = [
  {
    id: 'cancha-1',
    nombre: 'Cancha 1 - Futbol 5',
    categoria: 'Sintetica',
    ubicacion: 'Complejo Norte',
    estado: 'Disponible',
    capacidad: 10,
    precio: '$120.000',
    descripcion: 'Iluminación LED, césped renovado y vestuarios cercanos.',
    horarios: [
      { id: 'c1-17', hora: '17:00 - 18:00', estado: 'Disponible' },
      { id: 'c1-18', hora: '18:00 - 19:00', estado: 'Reservado' },
      { id: 'c1-19', hora: '19:00 - 20:00', estado: 'Disponible' },
      { id: 'c1-20', hora: '20:00 - 21:00', estado: 'Disponible' },
    ],
  },
  {
    id: 'cancha-2',
    nombre: 'Cancha 2 - Futbol 7',
    categoria: 'Profesional',
    ubicacion: 'Complejo Central',
    estado: 'Disponible',
    capacidad: 14,
    precio: '$165.000',
    descripcion: 'Ideal para partidos largos con tribuna y parqueadero cercano.',
    horarios: [
      { id: 'c2-17', hora: '17:00 - 18:00', estado: 'Ocupado' },
      { id: 'c2-18', hora: '18:00 - 19:00', estado: 'Disponible' },
      { id: 'c2-19', hora: '19:00 - 20:00', estado: 'Disponible' },
      { id: 'c2-20', hora: '20:00 - 21:00', estado: 'Reservado' },
    ],
  },
  {
    id: 'cancha-3',
    nombre: 'Cancha 3 - Multipropósito',
    categoria: 'Versátil',
    ubicacion: 'Complejo Sur',
    estado: 'Mantenimiento',
    capacidad: 12,
    precio: '$98.000',
    descripcion: 'Cancha temporalmente inactiva por revisión de superficie.',
    horarios: [
      { id: 'c3-17', hora: '17:00 - 18:00', estado: 'Disponible' },
      { id: 'c3-18', hora: '18:00 - 19:00', estado: 'Disponible' },
      { id: 'c3-19', hora: '19:00 - 20:00', estado: 'Disponible' },
      { id: 'c3-20', hora: '20:00 - 21:00', estado: 'Disponible' },
    ],
  },
];

function nextDateLabel(): string {
  const base = new Date();
  base.setDate(base.getDate() + 1);
  return base.toLocaleDateString('es-CO', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatReservationId(index: number): string {
  return `RS-${String(4100 + index).padStart(4, '0')}`;
}

export default function DashboardPage() {
  const canchasDisponibles = useMemo(
    () => canchasIniciales.filter((cancha) => cancha.estado === 'Disponible'),
    [],
  );

  const [fechaSeleccionada, setFechaSeleccionada] = useState(nextDateLabel());
  const [canchaSeleccionadaId, setCanchaSeleccionadaId] = useState(canchasDisponibles[0]?.id ?? '');
  const [horarioSeleccionadoId, setHorarioSeleccionadoId] = useState<string>('');
  const [notaReserva, setNotaReserva] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [reservasRecientes, setReservasRecientes] = useState<ReservaMock[]>([]);

  const canchaSeleccionada = canchasIniciales.find((cancha) => cancha.id === canchaSeleccionadaId) ?? null;

  const horariosVisibles = useMemo(() => {
    if (!canchaSeleccionada) {
      return [];
    }

    return canchaSeleccionada.horarios.filter((slot) => slot.estado === 'Disponible');
  }, [canchaSeleccionada]);

  const resumen = useMemo(
    () => ({
      canchas: canchasDisponibles.length,
      horarios: canchasDisponibles.reduce(
        (total, cancha) => total + cancha.horarios.filter((slot) => slot.estado === 'Disponible').length,
        0,
      ),
      reservas: reservasRecientes.length,
    }),
    [canchasDisponibles, reservasRecientes.length],
  );

  const handleCanchaChange = (canchaId: string) => {
    setCanchaSeleccionadaId(canchaId);
    setHorarioSeleccionadoId('');
    setMensaje('');
  };

  const handleReservar = () => {
    if (!canchaSeleccionada) {
      setMensaje('Selecciona una cancha disponible para continuar.');
      return;
    }

    if (!horarioSeleccionadoId) {
      setMensaje('Debes seleccionar un horario disponible.');
      return;
    }

    const slot = canchaSeleccionada.horarios.find((item) => item.id === horarioSeleccionadoId);
    if (!slot || slot.estado !== 'Disponible') {
      setMensaje('El horario elegido ya no está disponible.');
      return;
    }

    const nuevaReserva: ReservaMock = {
      id: formatReservationId(reservasRecientes.length + 1),
      cancha: canchaSeleccionada.nombre,
      fecha: fechaSeleccionada,
      hora: slot.hora,
      estado: 'Pendiente',
      monto: canchaSeleccionada.precio,
    };

    setReservasRecientes((actual) => [nuevaReserva, ...actual]);
    setMensaje(`Reserva ${nuevaReserva.id} creada en estado Pendiente.`);
    setHorarioSeleccionadoId('');
    setNotaReserva('');
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="reservas-title">
        <div className={styles.hero__copy}>
          <p className={styles.eyebrow}>Reserva de cliente</p>
          <h1 id="reservas-title" className={`${styles.title} ${sportsTitleFont.className}`}>
            Disponibilidad y creación de reservas
          </h1>
          <p className={styles.description}>
            Explora canchas disponibles, revisa horarios activos y genera una reserva en estado
            Pendiente sin salir del flujo visual.
          </p>
        </div>

        <div className={styles.summary} aria-label="Resumen rapido">
          <article>
            <span>Canchas disponibles</span>
            <strong>{resumen.canchas}</strong>
          </article>
          <article>
            <span>Horarios libres</span>
            <strong>{resumen.horarios}</strong>
          </article>
          <article>
            <span>Reservas creadas</span>
            <strong>{resumen.reservas}</strong>
          </article>
        </div>
      </section>

      <section className={styles.catalogSection} aria-labelledby="catalogo-title">
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Catálogo</p>
            <h2 id="catalogo-title" className={styles.sectionTitle}>
              Canchas disponibles para reservar
            </h2>
          </div>
          <p className={styles.sectionNote}>
            Se excluyen canchas en mantenimiento o no disponibles para cumplir las reglas del spec.
          </p>
        </div>

        <div className={styles.catalogGrid} role="list" aria-label="Listado de canchas disponibles">
          {canchasDisponibles.map((cancha) => {
            const isSelected = cancha.id === canchaSeleccionadaId;

            return (
              <button
                key={cancha.id}
                type="button"
                role="listitem"
                className={`${styles.canchaCard} ${isSelected ? styles.canchaCardActive : ''}`}
                onClick={() => handleCanchaChange(cancha.id)}
              >
                <div className={styles.canchaCard__head}>
                  <div>
                    <p className={styles.canchaCard__id}>{cancha.id}</p>
                    <h3>{cancha.nombre}</h3>
                  </div>
                  <span className={styles.badgeAvailable}>Disponible</span>
                </div>

                <p className={styles.canchaCard__description}>{cancha.descripcion}</p>

                <dl className={styles.canchaCard__meta}>
                  <div>
                    <dt>Ubicación</dt>
                    <dd>{cancha.ubicacion}</dd>
                  </div>
                  <div>
                    <dt>Capacidad</dt>
                    <dd>{cancha.capacidad} personas</dd>
                  </div>
                  <div>
                    <dt>Precio</dt>
                    <dd>{cancha.precio}</dd>
                  </div>
                  <div>
                    <dt>Categoría</dt>
                    <dd>{cancha.categoria}</dd>
                  </div>
                </dl>
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.bookingSection} aria-labelledby="booking-title">
        <div className={styles.bookingPanel}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Selector de reserva</p>
              <h2 id="booking-title" className={styles.sectionTitle}>
                Elegir horario y confirmar solicitud
              </h2>
            </div>
            <p className={styles.sectionNote}>La reserva queda simulada como Pendiente para reflejar el flujo del Spec 07.</p>
          </div>

          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Fecha</span>
              <input
                type="text"
                value={fechaSeleccionada}
                onChange={(event) => setFechaSeleccionada(event.target.value)}
                placeholder="Mié 21 jul 2026"
              />
            </label>

            <label className={styles.field}>
              <span>Cancha</span>
              <select value={canchaSeleccionadaId} onChange={(event) => handleCanchaChange(event.target.value)}>
                {canchasDisponibles.map((cancha) => (
                  <option key={cancha.id} value={cancha.id}>
                    {cancha.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>Horario</span>
              <select
                value={horarioSeleccionadoId}
                onChange={(event) => setHorarioSeleccionadoId(event.target.value)}
                disabled={!canchaSeleccionada}
              >
                <option value="">Selecciona un horario</option>
                {horariosVisibles.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.hora}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>Nota opcional</span>
              <textarea
                rows={3}
                value={notaReserva}
                onChange={(event) => setNotaReserva(event.target.value)}
                placeholder="Ej. Cumpleaños, partido amistoso, etc."
              />
            </label>
          </div>

          <div className={styles.actionsRow}>
            <button type="button" className={styles.primaryButton} onClick={handleReservar}>
              Reservar ahora
            </button>
            <span className={styles.helperText}>
              La selección actual será registrada como una reserva nueva en estado Pendiente.
            </span>
          </div>

          {mensaje ? (
            <p className={styles.feedback} role="status" aria-live="polite">
              {mensaje}
            </p>
          ) : null}
        </div>

        <aside className={styles.availabilityPanel} aria-label="Disponibilidad de la cancha seleccionada">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Disponibilidad</p>
              <h2 className={styles.sectionTitle}>Horarios activos del día</h2>
            </div>
            <p className={styles.sectionNote}>{canchaSeleccionada?.nombre ?? 'Selecciona una cancha'}</p>
          </div>

          {canchaSeleccionada ? (
            <div className={styles.slotGrid} role="list" aria-label="Horarios disponibles">
              {canchaSeleccionada.horarios.map((slot) => (
                <article
                  key={slot.id}
                  className={`${styles.slotCard} ${slot.estado !== 'Disponible' ? styles.slotCardBlocked : ''}`}
                  role="listitem"
                >
                  <strong>{slot.hora}</strong>
                  <span>
                    {slot.estado === 'Disponible'
                      ? 'Disponible'
                      : slot.estado === 'Reservado'
                        ? 'Reservado'
                        : 'Ocupado'}
                  </span>
                </article>
              ))}
            </div>
          ) : (
            <p className={styles.emptyState}>No hay canchas disponibles para reservar.</p>
          )}

          {canchaSeleccionada?.estado === 'Mantenimiento' ? (
            <p className={styles.warningState}>
              Esta cancha está en mantenimiento y queda excluida del flujo de reserva.
            </p>
          ) : null}
        </aside>
      </section>

      <section className={styles.recentSection} aria-labelledby="recientes-title">
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Confirmación visual</p>
            <h2 id="recientes-title" className={styles.sectionTitle}>
              Reservas creadas recientemente
            </h2>
          </div>
          <p className={styles.sectionNote}>La tarjeta muestra el detalle y el estado inicial Pendiente.</p>
        </div>

        <div className={styles.recentList} role="list" aria-label="Reservas recientes">
          {reservasRecientes.length > 0 ? (
            reservasRecientes.map((reserva) => (
              <article key={reserva.id} className={styles.recentCard} role="listitem">
                <div className={styles.recentCard__head}>
                  <div>
                    <p className={styles.canchaCard__id}>{reserva.id}</p>
                    <h3>{reserva.cancha}</h3>
                  </div>
                  <span className={styles.badgePending}>{reserva.estado}</span>
                </div>

                <dl className={styles.canchaCard__meta}>
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
                    <dt>Estado</dt>
                    <dd>Pendiente</dd>
                  </div>
                </dl>
              </article>
            ))
          ) : (
            <p className={styles.emptyState}>Aún no has creado reservas desde esta pantalla.</p>
          )}
        </div>
      </section>
    </main>
  );
}
