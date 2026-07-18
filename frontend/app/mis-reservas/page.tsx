'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Bebas_Neue } from 'next/font/google';
import { getStoredAuthToken } from '../../lib/auth';

type EstadoReserva = 'Pendiente' | 'Confirmada' | 'Finalizada' | 'Cancelada';

type ReservaMock = {
  id: string;
  cancha: string;
  fecha: string;
  hora: string;
  monto: string;
  estado: EstadoReserva;
};

type FormValues = {
  cancha: string;
  fecha: string;
  hora: string;
  monto: string;
};

const sportsTitleFont = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const reservasIniciales: ReservaMock[] = [
  {
    id: 'MR-3101',
    cancha: 'Cancha 1 - Futbol 5',
    fecha: '2026-07-20',
    hora: '18:00 - 19:00',
    monto: '$120.000',
    estado: 'Pendiente',
  },
  {
    id: 'MR-3102',
    cancha: 'Cancha 2 - Futbol 7',
    fecha: '2026-07-20',
    hora: '20:00 - 21:00',
    monto: '$165.000',
    estado: 'Confirmada',
  },
  {
    id: 'MR-3103',
    cancha: 'Cancha 3 - Multiproposito',
    fecha: '2026-07-24',
    hora: '21:00 - 22:00',
    monto: '$98.000',
    estado: 'Confirmada',
  },
];

const formInicial: FormValues = {
  cancha: 'Cancha 1 - Futbol 5',
  fecha: '',
  hora: '18:00 - 19:00',
  monto: '$120.000',
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

export default function MisReservasPage() {
  const [reservas, setReservas] = useState<ReservaMock[]>([]);
  const [form, setForm] = useState<FormValues>(formInicial);
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resumen = useMemo(
    () => ({
      Pendiente: reservas.filter((reserva) => reserva.estado === 'Pendiente').length,
      Confirmada: reservas.filter((reserva) => reserva.estado === 'Confirmada').length,
      Finalizada: reservas.filter((reserva) => reserva.estado === 'Finalizada').length,
      Cancelada: reservas.filter((reserva) => reserva.estado === 'Cancelada').length,
    }),
    [reservas],
  );

  const obtenerHorasRestantes = (reserva: ReservaMock): number => {
    const inicio = reserva.hora.split('-')[0]?.trim() ?? '00:00';
    const fechaHora = new Date(`${reserva.fecha}T${inicio}:00`);
    if (Number.isNaN(fechaHora.getTime())) {
      return Number.POSITIVE_INFINITY;
    }

    return (fechaHora.getTime() - Date.now()) / (1000 * 60 * 60);
  };

  const getAuthHeaders = (): HeadersInit => {
    const token = getStoredAuthToken();

    if (!token) {
      throw new Error('No se encontró token. Inicia sesión nuevamente.');
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  const cargarReservas = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reservas/mias`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message ?? 'No se pudieron cargar las reservas.');
      }

      const data = (await response.json()) as ReservaMock[];
      setReservas(data);
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'Error cargando reservas.');
      setReservas(reservasIniciales);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void cargarReservas();
  }, []);

  const crearReserva = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.fecha) {
      setMensaje('Debes seleccionar una fecha para crear la reserva.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reservas`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message ?? 'No se pudo crear la reserva.');
      }

      const nuevaReserva = (await response.json()) as ReservaMock;
      setReservas((actual) => [nuevaReserva, ...actual]);
      setMensaje(
        `Reserva ${nuevaReserva.id} creada con exito en estado Pendiente. Ya puedes confirmarla o cancelarla.`,
      );
      setForm(formInicial);
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'Error creando reserva.');
    } finally {
      setIsLoading(false);
    }
  };

  const actualizarEstado = async (id: string, nuevoEstado: EstadoReserva) => {
    const reserva = reservas.find((item) => item.id === id);
    if (!reserva) {
      return;
    }

    if (reserva.estado === 'Confirmada' && nuevoEstado === 'Cancelada') {
      const horasRestantes = obtenerHorasRestantes(reserva);
      if (horasRestantes < 24) {
        setMensaje(
          `La reserva ${id} esta confirmada y falta menos de 24 horas. Debes ir al punto fisico para gestionarla.`,
        );
        return;
      }
    }

    const transicionValida =
      (reserva.estado === 'Pendiente' && (nuevoEstado === 'Confirmada' || nuevoEstado === 'Cancelada')) ||
      (reserva.estado === 'Confirmada' && nuevoEstado === 'Cancelada');

    if (!transicionValida) {
      setMensaje(`No puedes cambiar la reserva ${id} desde ${reserva.estado} hacia ${nuevoEstado}.`);
      return;
    }

    const endpoint = nuevoEstado === 'Confirmada' ? 'confirmar' : 'cancelar';

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reservas/${id}/${endpoint}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message ?? 'No se pudo actualizar la reserva.');
      }

      const actualizada = (await response.json()) as ReservaMock;
      setReservas((actual) => actual.map((item) => (item.id === id ? actualizada : item)));

      if (nuevoEstado === 'Cancelada') {
        setMensaje(`Reserva ${id} cancelada. El horario se libero en el backend.`);
      } else {
        setMensaje(`Reserva ${id} confirmada correctamente.`);
      }
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'Error actualizando reserva.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mis-reservas" aria-label="Mis reservas personales">
      <header className="mis-reservas__header">
        <p className="mis-reservas__eyebrow">Mi cuenta</p>
        <h2 className={`mis-reservas__title ${sportsTitleFont.className}`}>Mis Reservas</h2>
        <p className="mis-reservas__description">
          Crea tu reserva y gestiona su estado en esta misma pantalla. Toda reserva inicia como
          Pendiente y solo podras operar sobre tus propios turnos.
        </p>
      </header>

      <form className="cliente-reserva-form" onSubmit={crearReserva} aria-label="Formulario de reserva">
        <h3 className={sportsTitleFont.className}>Crear nueva reserva</h3>
        <div className="cliente-reserva-form__grid">
          <label>
            Cancha
            <select
              value={form.cancha}
              onChange={(event) => setForm((actual) => ({ ...actual, cancha: event.target.value }))}
            >
              <option value="Cancha 1 - Futbol 5">Cancha 1 - Futbol 5</option>
              <option value="Cancha 2 - Futbol 7">Cancha 2 - Futbol 7</option>
              <option value="Cancha 3 - Multiproposito">Cancha 3 - Multiproposito</option>
            </select>
          </label>

          <label>
            Fecha
            <input
              type="date"
              value={form.fecha}
              min={new Date().toISOString().split('T')[0]}
              onChange={(event) => setForm((actual) => ({ ...actual, fecha: event.target.value }))}
            />
          </label>

          <label>
            Horario
            <select
              value={form.hora}
              onChange={(event) => setForm((actual) => ({ ...actual, hora: event.target.value }))}
            >
              <option value="17:00 - 18:00">17:00 - 18:00</option>
              <option value="18:00 - 19:00">18:00 - 19:00</option>
              <option value="19:00 - 20:00">19:00 - 20:00</option>
              <option value="20:00 - 21:00">20:00 - 21:00</option>
            </select>
          </label>

          <label>
            Valor
            <select
              value={form.monto}
              onChange={(event) => setForm((actual) => ({ ...actual, monto: event.target.value }))}
            >
              <option value="$98.000">$98.000</option>
              <option value="$120.000">$120.000</option>
              <option value="$165.000">$165.000</option>
            </select>
          </label>
        </div>

        <div className="cliente-reserva-form__actions">
          <button type="submit" className="welcome-button welcome-button--cta" disabled={isLoading}>
            Reservar ahora
          </button>
        </div>
      </form>

      {mensaje ? (
        <p className="mis-reservas__feedback" role="status" aria-live="polite">
          {mensaje}
        </p>
      ) : null}

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

      <div className="reservas-grid" role="list" aria-label="Listado de reservas">
        {isLoading && reservas.length === 0 ? <p>Cargando reservas...</p> : null}
        {reservas.map((reserva) => {
          const horasRestantes = obtenerHorasRestantes(reserva);
          const bloquearCancelacionConfirmada =
            reserva.estado === 'Confirmada' && Number.isFinite(horasRestantes) && horasRestantes < 24;

          return (
            <article className="reserva-card" key={reserva.id} role="listitem">
              <div className="reserva-card__head">
                <div>
                  <p className="reserva-card__id">{reserva.id}</p>
                  <h3>Reserva personal</h3>
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

              <div className="cliente-reserva-card__actions">
                <button
                  type="button"
                  onClick={() => actualizarEstado(reserva.id, 'Confirmada')}
                  disabled={reserva.estado !== 'Pendiente' || isLoading}
                >
                  Confirmar Reserva
                </button>
                <button
                  type="button"
                  className="cliente-reserva-card__cancel"
                  onClick={() => actualizarEstado(reserva.id, 'Cancelada')}
                  disabled={
                    reserva.estado === 'Cancelada' ||
                    reserva.estado === 'Finalizada' ||
                    bloquearCancelacionConfirmada ||
                    isLoading
                  }
                >
                  Cancelar Reserva
                </button>
              </div>

              {bloquearCancelacionConfirmada ? (
                <p className="cliente-reserva-card__warning">
                  Faltan menos de 24 horas y la reserva ya esta Confirmada. Debes ir al punto fisico
                  para gestionar la cancelacion.
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
