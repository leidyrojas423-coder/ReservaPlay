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
    fecha: '2026-07-21',
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
];

const transicionesPermitidas: Record<EstadoReserva, EstadoReserva[]> = {
  Pendiente: ['Confirmada', 'Cancelada'],
  Confirmada: ['Finalizada', 'Cancelada'],
  Finalizada: [],
  Cancelada: [],
};

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

function getAccionesPermitidas(estado: EstadoReserva): EstadoReserva[] {
  return transicionesPermitidas[estado];
}

function crearMensajeAccion(destino: EstadoReserva): string {
  switch (destino) {
    case 'Confirmada':
      return 'Confirmar pago';
    case 'Finalizada':
      return 'Finalizar';
    case 'Cancelada':
      return 'Cancelar';
    default:
      return 'Actualizar';
  }
}

export default function AdminEstadosReservasPage() {
  const [reservas, setReservas] = useState<ReservaAdmin[]>(reservasIniciales);
  const [mensaje, setMensaje] = useState('');

  const columnas = useMemo(() => {
    const pendientes = reservas.filter((r) => r.estado === 'Pendiente');
    const confirmadas = reservas.filter((r) => r.estado === 'Confirmada');
    const finalizadas = reservas.filter((r) => r.estado === 'Finalizada');
    const canceladas = reservas.filter((r) => r.estado === 'Cancelada');

    return { pendientes, confirmadas, finalizadas, canceladas };
  }, [reservas]);

  const cambiarEstado = (id: string, nuevoEstado: EstadoReserva) => {
    const reserva = reservas.find((item) => item.id === id);

    if (!reserva) {
      return;
    }

    if (reserva.estado === nuevoEstado) {
      setMensaje(`La reserva ${id} ya esta en estado ${nuevoEstado}.`);
      return;
    }

    const permitido = transicionesPermitidas[reserva.estado].includes(nuevoEstado);

    if (!permitido) {
      setMensaje(`Transicion invalida: ${reserva.estado} -> ${nuevoEstado}.`);
      return;
    }

    setReservas((actual) =>
      actual.map((item) => (item.id === id ? { ...item, estado: nuevoEstado } : item)),
    );
    setMensaje(`Reserva ${id} actualizada: ${reserva.estado} -> ${nuevoEstado}.`);
  };

  const renderTarjeta = (reserva: ReservaAdmin) => {
    const acciones = getAccionesPermitidas(reserva.estado);

    return (
      <article className="admin-estados-card" key={reserva.id}>
        <div className="admin-estados-card__head">
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

        {acciones.length > 0 ? (
          <div className="admin-estados-card__actions">
            {acciones.map((accion) => (
              <button key={`${reserva.id}-${accion}`} type="button" onClick={() => cambiarEstado(reserva.id, accion)}>
                {crearMensajeAccion(accion)}
              </button>
            ))}
          </div>
        ) : (
          <p className="admin-estados-card__locked">Sin acciones disponibles.</p>
        )}
      </article>
    );
  };

  return (
    <section className="admin-estados" aria-label="Gestion de estados de reservas">
      <header className="admin-estados__header">
        <p className="mis-reservas__eyebrow">Panel administrativo</p>
        <h2 className={`mis-reservas__title ${sportsTitleFont.className}`}>Estados de reservas</h2>
        <p className="mis-reservas__description">
          Flujo habilitado: Pendiente a Confirmada a Finalizada, Pendiente a Cancelada y
          Confirmada a Cancelada.
        </p>
      </header>

      {mensaje ? (
        <p className="mis-reservas__feedback" role="status" aria-live="polite">
          {mensaje}
        </p>
      ) : null}

      <div className="admin-estados-board" role="list" aria-label="Tablero de estados">
        <section className="admin-estados-column admin-estados-column--pendiente" role="listitem" aria-label="Pendientes">
          <header>
            <h3>Pendientes</h3>
            <span>{columnas.pendientes.length}</span>
          </header>
          <div className="admin-estados-column__content">
            {columnas.pendientes.map(renderTarjeta)}
          </div>
        </section>

        <section className="admin-estados-column admin-estados-column--confirmada" role="listitem" aria-label="Confirmadas">
          <header>
            <h3>Confirmadas</h3>
            <span>{columnas.confirmadas.length}</span>
          </header>
          <div className="admin-estados-column__content">
            {columnas.confirmadas.map(renderTarjeta)}
          </div>
        </section>

        <section className="admin-estados-column admin-estados-column--finalizada" role="listitem" aria-label="Finalizadas">
          <header>
            <h3>Finalizadas</h3>
            <span>{columnas.finalizadas.length}</span>
          </header>
          <div className="admin-estados-column__content">
            {columnas.finalizadas.map(renderTarjeta)}
          </div>
        </section>
      </div>

      <section className="admin-estados-canceladas" aria-label="Reservas canceladas">
        <header>
          <h3>Canceladas</h3>
          <span>{columnas.canceladas.length}</span>
        </header>
        <div className="admin-estados-canceladas__content">
          {columnas.canceladas.length > 0 ? (
            columnas.canceladas.map(renderTarjeta)
          ) : (
            <p>No hay reservas canceladas.</p>
          )}
        </div>
      </section>
    </section>
  );
}
