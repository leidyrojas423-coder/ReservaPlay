'use client';

import { useMemo, useState } from 'react';
import { Bebas_Neue } from 'next/font/google';

type EstadoReserva = 'Pendiente' | 'Confirmada' | 'Finalizada' | 'Cancelada';

type ReservaAdmin = {
  id: string;
  cliente: string;
  cancha: string;
  fecha: string;
  hora: string;
  monto: string;
  estado: EstadoReserva;
};

const sportsTitleFont = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
});

const estados: EstadoReserva[] = ['Pendiente', 'Confirmada', 'Finalizada', 'Cancelada'];

const transicionesPermitidas: Record<EstadoReserva, EstadoReserva[]> = {
  Pendiente: ['Confirmada', 'Cancelada'],
  Confirmada: ['Finalizada', 'Cancelada'],
  Finalizada: [],
  Cancelada: [],
};

const reservasIniciales: ReservaAdmin[] = [
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
    estado: 'Confirmada',
  },
  {
    id: 'R-1203',
    cliente: 'Carlos Duran',
    cancha: 'Cancha 3 - Multiproposito',
    fecha: '2026-07-15',
    hora: '17:00 - 18:00',
    monto: '$98.000',
    estado: 'Finalizada',
  },
  {
    id: 'R-1204',
    cliente: 'Sofia Rojas',
    cancha: 'Cancha 1 - Futbol 5',
    fecha: '2026-07-21',
    hora: '19:00 - 20:00',
    monto: '$120.000',
    estado: 'Cancelada',
  },
];

function getEstadoClase(estado: EstadoReserva): string {
  switch (estado) {
    case 'Pendiente':
      return 'estado-chip estado-chip--pendiente';
    case 'Confirmada':
      return 'estado-chip estado-chip--confirmada';
    case 'Finalizada':
      return 'estado-chip estado-chip--finalizada';
    case 'Cancelada':
      return 'estado-chip estado-chip--cancelada';
    default:
      return 'estado-chip';
  }
}

function accionDesdeEstado(estado: EstadoReserva): string {
  switch (estado) {
    case 'Confirmada':
      return 'Confirmar pago';
    case 'Finalizada':
      return 'Finalizar';
    case 'Cancelada':
      return 'Cancelar';
    default:
      return 'Sin accion';
  }
}

export default function AdminReservasPage() {
  const [reservas, setReservas] = useState<ReservaAdmin[]>(reservasIniciales);
  const [proximosEstados, setProximosEstados] = useState<Record<string, EstadoReserva>>(
    Object.fromEntries(reservasIniciales.map((reserva) => [reserva.id, reserva.estado])),
  );
  const [mensaje, setMensaje] = useState<string>('');

  const resumen = useMemo(() => {
    return reservas.reduce(
      (acc, reserva) => {
        acc[reserva.estado] += 1;
        return acc;
      },
      {
        Pendiente: 0,
        Confirmada: 0,
        Finalizada: 0,
        Cancelada: 0,
      } as Record<EstadoReserva, number>,
    );
  }, [reservas]);

  const aplicarCambioEstado = (id: string) => {
    const reserva = reservas.find((item) => item.id === id);
    const nuevoEstado = proximosEstados[id];

    if (!reserva || !nuevoEstado) {
      return;
    }

    if (reserva.estado === nuevoEstado) {
      setMensaje(`La reserva ${id} ya está en estado ${nuevoEstado}.`);
      return;
    }

    const permitido = transicionesPermitidas[reserva.estado].includes(nuevoEstado);

    if (!permitido) {
      setMensaje(`Transición inválida: ${reserva.estado} -> ${nuevoEstado}.`);
      return;
    }

    setReservas((actual) =>
      actual.map((item) => (item.id === id ? { ...item, estado: nuevoEstado } : item)),
    );

    setMensaje(`Reserva ${id} actualizada: ${reserva.estado} -> ${nuevoEstado}.`);
  };

  return (
    <section className="mis-reservas" aria-label="Gestión administrativa de reservas">
      <header className="mis-reservas__header">
        <p className="mis-reservas__eyebrow">Panel administrativo</p>
        <h2 className={`mis-reservas__title ${sportsTitleFont.className}`}>Gestión de reservas</h2>
        <p className="mis-reservas__description">
          Administra el ciclo de vida de las reservas con el flujo permitido: Pendiente a
          Confirmada o Cancelada, y Confirmada a Finalizada o Cancelada.
        </p>
      </header>

      <section className="mis-reservas__summary" aria-label="Resumen de estados">
        <article className="resumen-card resumen-card--pendiente">
          <span>Pendientes</span>
          <strong>{resumen.Pendiente}</strong>
        </article>
        <article className="resumen-card resumen-card--confirmada">
          <span>Confirmadas</span>
          <strong>{resumen.Confirmada}</strong>
        </article>
        <article className="resumen-card resumen-card--finalizada">
          <span>Finalizadas</span>
          <strong>{resumen.Finalizada}</strong>
        </article>
        <article className="resumen-card resumen-card--cancelada">
          <span>Canceladas</span>
          <strong>{resumen.Cancelada}</strong>
        </article>
      </section>

      {mensaje ? (
        <p className="mis-reservas__feedback" role="status" aria-live="polite">
          {mensaje}
        </p>
      ) : null}

      <div className="reservas-grid" role="list" aria-label="Listado administrativo de reservas">
        {reservas.map((reserva) => {
          const opcionesPermitidas = [reserva.estado, ...transicionesPermitidas[reserva.estado]];
          return (
            <article className="reserva-card" key={reserva.id} role="listitem">
              <div className="reserva-card__head">
                <div>
                  <p className="reserva-card__id">{reserva.id}</p>
                  <h3>{reserva.cliente}</h3>
                </div>
                <span className={getEstadoClase(reserva.estado)}>{reserva.estado}</span>
              </div>

              <dl className="reserva-card__meta">
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

              <div className="reserva-card__actions">
                <label htmlFor={`estado-${reserva.id}`}>Cambio de estado</label>
                <div className="reserva-card__controls">
                  <select
                    id={`estado-${reserva.id}`}
                    value={proximosEstados[reserva.id] ?? reserva.estado}
                    onChange={(event) => {
                      const estado = event.target.value as EstadoReserva;
                      setProximosEstados((actual) => ({ ...actual, [reserva.id]: estado }));
                    }}
                  >
                    {estados.map((estado) => {
                      const disabled = !opcionesPermitidas.includes(estado);
                      return (
                        <option key={estado} value={estado} disabled={disabled}>
                          {estado}
                        </option>
                      );
                    })}
                  </select>

                  <button type="button" onClick={() => aplicarCambioEstado(reserva.id)}>
                    {accionDesdeEstado(proximosEstados[reserva.id] ?? reserva.estado)}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
