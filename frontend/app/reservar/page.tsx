"use client";

import { useEffect, useMemo, useState } from "react";
import { crearReserva } from "../../services/reservas.service";
import { obtenerCanchas, type Cancha } from "../../services/canchas.service";
import {
  obtenerHorariosPorCancha,
  type Horario,
} from "../../services/horarios.service";
import styles from "./reservar.module.css";

export default function ReservarPage() {
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [canchaId, setCanchaId] = useState("");
  const [horarioId, setHorarioId] = useState("");
  const [fechaReserva, setFechaReserva] = useState("");
  const [loadingCanchas, setLoadingCanchas] = useState(true);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const formatHora = (valor: string) =>
    new Date(valor).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Bogota",
    });

  const labelHorario = (horario: Horario) =>
    `${formatHora(horario.fechaInicio)} - ${formatHora(horario.fechaFin)}`;

  const horariosOrdenados = useMemo(
    () =>
      [...horarios].sort(
        (a, b) =>
          new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
      ),
    [horarios]
  );

  useEffect(() => {
    const cargarCanchas = async () => {
      try {
        setLoadingCanchas(true);
        const data = await obtenerCanchas();
        setCanchas(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "No se pudieron cargar las canchas"
        );
      } finally {
        setLoadingCanchas(false);
      }
    };

    void cargarCanchas();
  }, []);

  useEffect(() => {
    const cargarHorarios = async () => {
      if (!canchaId) {
        setHorarios([]);
        setHorarioId("");
        setMensaje("");
        return;
      }

      try {
        setLoadingHorarios(true);
        setError("");
        const data = await obtenerHorariosPorCancha(canchaId);
        setHorarios(data);
        setHorarioId("");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar los horarios"
        );
      } finally {
        setLoadingHorarios(false);
      }
    };

    void cargarHorarios();
  }, [canchaId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!canchaId || !horarioId || !fechaReserva) {
      setError("Seleccione cancha, horario y fecha antes de reservar");
      return;
    }

    try {
      setEnviando(true);
      await crearReserva({
        canchaId,
        horarioId,
        fechaReserva,
      });

      setMensaje("Reserva creada correctamente");
      setHorarioId("");
      setFechaReserva("");
    } catch (error: unknown) {
      if (error instanceof Error && error.message.trim().length > 0) {
        setError(error.message);
      } else {
        setError("Error al crear reserva");
      }
    } finally {
      setEnviando(false);
    }
  };
  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Reservar Cancha</h1>

        <label htmlFor="cancha">Cancha</label>
        <select
          id="cancha"
          value={canchaId}
          onChange={(e) => setCanchaId(e.target.value)}
          required
          disabled={loadingCanchas}
        >
          <option value="">
            {loadingCanchas ? "Cargando canchas..." : "Seleccione una cancha"}
          </option>
          {canchas.map((cancha) => (
            <option key={cancha.id} value={cancha.id}>
              {cancha.nombre}
            </option>
          ))}
        </select>

        <label htmlFor="horario">Horario disponible</label>
        <select
          id="horario"
          value={horarioId}
          onChange={(e) => setHorarioId(e.target.value)}
          required
          disabled={!canchaId || loadingHorarios}
        >
          <option value="">
            {!canchaId
              ? "Seleccione una cancha primero"
              : loadingHorarios
              ? "Cargando horarios..."
              : "Seleccione un horario"}
          </option>
          {horariosOrdenados.map((horario) => (
            <option key={horario.id} value={horario.id}>
              {labelHorario(horario)}
            </option>
          ))}
        </select>

        {!!canchaId && !loadingHorarios && horariosOrdenados.length === 0 && (
          <p className={styles.helper}>No hay horarios disponibles para esta cancha.</p>
        )}

        <label htmlFor="fechaReserva">Fecha de reserva</label>
        <input
          id="fechaReserva"
          type="date"
          value={fechaReserva}
          onChange={(e) => setFechaReserva(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          required
        />

        <button type="submit" disabled={enviando}>
          {enviando ? "Enviando..." : "Confirmar reserva"}
        </button>

        {error && <p className={styles.error}>{error}</p>}
        {mensaje && <p className={styles.success}>{mensaje}</p>}
      </form>
    </main>
  );
}