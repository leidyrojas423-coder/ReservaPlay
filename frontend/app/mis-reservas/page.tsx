'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Bebas_Neue } from 'next/font/google';
import { getStoredAuthToken } from '../../lib/auth';

type EstadoReserva = 'Pendiente' | 'Confirmada' | 'Finalizada' | 'Cancelada';

type TabActiva = 'reservas' | 'mis-reservas' | 'estado';

type ReservaData = {
  id: string;
  cancha: string;
  fecha: string;
  hora: string;
  monto: string;
  estado: EstadoReserva;
  motivoCancelacion?: string | null;
  canceladaEn?: string | null;
  canceladaPor?: string | null;
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

const reservasIniciales: ReservaData[] = [
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

const tabs: Array<{ id: TabActiva; label: string }> = [
  { id: 'reservas', label: 'Reservas' },
  { id: 'mis-reservas', label: 'Mis Reservas' },
  { id: 'estado', label: 'Estado de Reservas' },
];

const canchasDisponibles = [
  'Cancha 1 - Futbol 5',
  'Cancha 2 - Futbol 7',
  'Cancha 3 - Multiproposito',
];

const horariosDisponibles = ['17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00'];

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
  const [tabActiva, setTabActiva] = useState<TabActiva>('reservas');
  const [reservas, setReservas] = useState<ReservaData[]>([]);
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

  const obtenerHorasRestantes = (reserva: ReservaData): number => {
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

      const data = (await response.json()) as ReservaData[];
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

      const nuevaReserva = (await response.json()) as ReservaData;
      setReservas((actual) => [nuevaReserva, ...actual]);
      setMensaje(
        `Reserva ${nuevaReserva.id} creada con exito en estado Pendiente. Ya puedes confirmarla o cancelarla.`,
      );
      setForm(formInicial);
      setTabActiva('mis-reservas');
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

      const actualizada = (await response.json()) as ReservaData;
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

  const disponibilidad = useMemo(() => {
    if (!form.fecha) {
      return [];
    }

    return horariosDisponibles.map((horario) => {
      const ocupado = reservas.some(
        (reserva) =>
          reserva.cancha === form.cancha &&
          reserva.fecha === form.fecha &&
          reserva.hora === horario &&
          reserva.estado !== 'Cancelada',
      );

      return {
        horario,
        ocupado,
      };
    });
  }, [form.cancha, form.fecha, reservas]);

  const reservasActivas = useMemo(
    () => reservas.filter((reserva) => reserva.estado !== 'Cancelada'),
    [reservas],
  );

  const reservasCanceladas = useMemo(
    () => reservas.filter((reserva) => reserva.estado === 'Cancelada'),
    [reservas],
  );

  const porEstado = useMemo(
    () => ({
      pendientes: reservas.filter((reserva) => reserva.estado === 'Pendiente'),
      confirmadas: reservas.filter((reserva) => reserva.estado === 'Confirmada'),
      finalizadas: reservas.filter((reserva) => reserva.estado === 'Finalizada'),
      canceladas: reservasCanceladas,
    }),
    [reservas, reservasCanceladas],
  );

  const renderMetaReserva = (reserva: ReservaData) => (
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
  );

  return (
    <section className="mis-reservas" aria-label="Mis reservas personales">
      <header className="mis-reservas__header">
        <p className="mis-reservas__eyebrow">Mi cuenta</p>
        <h2 className={`mis-reservas__title ${sportsTitleFont.className}`}>Mis Reservas</h2>
        <p className="mis-reservas__description">
          Gestiona tu experiencia completa desde tres pestañas: Reservas, Mis Reservas y Estado de
          Reservas.
        </p>
      </header>

      <nav className="mis-reservas-tabs" aria-label="Secciones de reservas">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`mis-reservas-tabs__tab ${tabActiva === tab.id ? 'is-active' : ''}`}
            onClick={() => setTabActiva(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {tabActiva === 'reservas' ? (
        <section className="mis-reservas-panel" aria-label="Crear reservas">
          <form className="cliente-reserva-form" onSubmit={crearReserva} aria-label="Formulario de reserva">
            <h3 className={sportsTitleFont.className}>Reservas</h3>
            <div className="cliente-reserva-form__grid">
              <label>
                Cancha
                <select
                  value={form.cancha}
                  onChange={(event) => setForm((actual) => ({ ...actual, cancha: event.target.value }))}
                >
                  {canchasDisponibles.map((cancha) => (
                    <option key={cancha} value={cancha}>
                      {cancha}
                    </option>
                  ))}
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
                  {horariosDisponibles.map((horario) => (
                    <option key={horario} value={horario}>
                      {horario}
                    </option>
                  ))}
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

          <section className="reserva-disponibilidad" aria-label="Disponibilidad por horario">
            <h3 className={sportsTitleFont.className}>Disponibilidad de la cancha seleccionada</h3>
            {!form.fecha ? <p>Selecciona una fecha para ver los cupos disponibles.</p> : null}
            <div className="reserva-disponibilidad__grid">
              {disponibilidad.map((slot) => (
                <article
                  key={slot.horario}
                  className={`reserva-disponibilidad__slot ${slot.ocupado ? 'is-ocupado' : 'is-libre'}`}
                >
                  <strong>{slot.horario}</strong>
                  <span>{slot.ocupado ? 'Ocupado' : 'Disponible'}</span>
                </article>
              ))}
            </div>
          </section>
        </section>
      ) : null}

      {mensaje ? (
        <p className="mis-reservas__feedback" role="status" aria-live="polite">
          {mensaje}
        </p>
      ) : null}

      {tabActiva === 'mis-reservas' ? (
        <>
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

          <div className="reservas-grid" role="list" aria-label="Listado de mis reservas">
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

                  {renderMetaReserva(reserva)}

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
                      Faltan menos de 24 horas y la reserva ya esta Confirmada. Debes ir al punto
                      fisico para gestionar la cancelacion.
                    </p>
                  ) : null}

                  {reserva.estado === 'Cancelada' && reserva.motivoCancelacion ? (
                    <p className="cliente-reserva-card__warning">
                      Motivo de cancelacion: {reserva.motivoCancelacion}
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>
        </>
      ) : null}

      {tabActiva === 'estado' ? (
        <section className="estado-reservas-panel" aria-label="Estado actual de reservas">
          <div className="estado-reservas-panel__grid">
            <article className="estado-reservas-columna estado-reservas-columna--pendiente">
              <header>
                <h3>Pendientes</h3>
                <span>{porEstado.pendientes.length}</span>
              </header>
              <div className="estado-reservas-columna__content">
                {porEstado.pendientes.length > 0 ? (
                  porEstado.pendientes.map((reserva) => (
                    <article className="estado-reservas-item" key={reserva.id}>
                      <strong>{reserva.id}</strong>
                      <p>{reserva.cancha}</p>
                      <small>
                        {reserva.fecha} · {reserva.hora}
                      </small>
                    </article>
                  ))
                ) : (
                  <p>No hay pendientes.</p>
                )}
              </div>
            </article>

            <article className="estado-reservas-columna estado-reservas-columna--confirmada">
              <header>
                <h3>Confirmadas</h3>
                <span>{porEstado.confirmadas.length}</span>
              </header>
              <div className="estado-reservas-columna__content">
                {porEstado.confirmadas.length > 0 ? (
                  porEstado.confirmadas.map((reserva) => (
                    <article className="estado-reservas-item" key={reserva.id}>
                      <strong>{reserva.id}</strong>
                      <p>{reserva.cancha}</p>
                      <small>
                        {reserva.fecha} · {reserva.hora}
                      </small>
                    </article>
                  ))
                ) : (
                  <p>No hay confirmadas.</p>
                )}
              </div>
            </article>

            <article className="estado-reservas-columna estado-reservas-columna--finalizada">
              <header>
                <h3>Finalizadas</h3>
                <span>{porEstado.finalizadas.length}</span>
              </header>
              <div className="estado-reservas-columna__content">
                {porEstado.finalizadas.length > 0 ? (
                  porEstado.finalizadas.map((reserva) => (
                    <article className="estado-reservas-item" key={reserva.id}>
                      <strong>{reserva.id}</strong>
                      <p>{reserva.cancha}</p>
                      <small>
                        {reserva.fecha} · {reserva.hora}
                      </small>
                    </article>
                  ))
                ) : (
                  <p>No hay finalizadas.</p>
                )}
              </div>
            </article>
          </div>

          <article className="estado-reservas-canceladas">
            <header>
              <h3>Canceladas</h3>
              <span>{porEstado.canceladas.length}</span>
            </header>
            <div className="estado-reservas-columna__content">
              {porEstado.canceladas.length > 0 ? (
                porEstado.canceladas.map((reserva) => (
                  <article className="estado-reservas-item" key={reserva.id}>
                    <strong>{reserva.id}</strong>
                    <p>{reserva.cancha}</p>
                    <small>
                      {reserva.fecha} · {reserva.hora}
                    </small>
                  </article>
                ))
              ) : (
                <p>No hay canceladas.</p>
              )}
            </div>
          </article>

          <section className="mis-reservas__summary" aria-label="Resumen de estados">
            <article className="resumen-card resumen-card--pendiente">
              <span>Reservas activas</span>
              <strong>{reservasActivas.length}</strong>
            </article>
            <article className="resumen-card resumen-card--cancelada">
              <span>Reservas canceladas</span>
              <strong>{reservasCanceladas.length}</strong>
            </article>
            <article className="resumen-card resumen-card--confirmada">
              <span>Confirmadas hoy</span>
              <strong>{porEstado.confirmadas.length}</strong>
            </article>
            <article className="resumen-card resumen-card--finalizada">
              <span>Finalizadas</span>
              <strong>{porEstado.finalizadas.length}</strong>
            </article>
          </section>
        </section>
      ) : null}
    </section>
  );
}
