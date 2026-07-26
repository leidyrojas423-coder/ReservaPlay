"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { obtenerHorariosPorCancha } from "../../../services/horarios.service";

type Horario = {
  id?: string | number;
  _id?: string;
  horaInicio?: string;
  horaFin?: string;
  estado?: string;
  hora_inicio?: string;
  hora_fin?: string;
};

type HorariosResponse = Horario[] | { data: Horario[] };

const extraerTexto = (valor?: string) => (valor ? valor : "No disponible");

export default function CanchaHorariosPage() {
  const params = useParams<{ id: string }>();
  const canchaId = useMemo(() => params?.id ?? "", [params]);

  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarHorarios = async () => {
      if (!canchaId) {
        setError("No se encontró el identificador de la cancha.");
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        setError(null);

        const respuesta = (await obtenerHorariosPorCancha(canchaId)) as HorariosResponse;
        const data = Array.isArray(respuesta) ? respuesta : respuesta?.data;

        setHorarios(Array.isArray(data) ? data : []);
      } catch {
        setError("No se pudieron cargar los horarios.");
      } finally {
        setCargando(false);
      }
    };

    void cargarHorarios();
  }, [canchaId]);

  if (cargando) {
    return (
      <main>
        <h1>Horarios de la cancha</h1>
        <p>Cargando...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Horarios de la cancha</h1>
        <p>{error}</p>
      </main>
    );
  }

  if (horarios.length === 0) {
    return (
      <main>
        <h1>Horarios de la cancha</h1>
        <p>No hay horarios disponibles.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Horarios de la cancha</h1>

      {horarios.map((horario) => {
        const horaInicio = extraerTexto(horario.horaInicio ?? horario.hora_inicio);
        const horaFin = extraerTexto(horario.horaFin ?? horario.hora_fin);
        const estado = extraerTexto(horario.estado);

        return (
          <article key={String(horario._id ?? horario.id ?? `${horaInicio}-${horaFin}`)}>
            <p>
              <strong>Hora inicio:</strong> {horaInicio}
            </p>
            <p>
              <strong>Hora fin:</strong> {horaFin}
            </p>
            <p>
              <strong>Estado:</strong> {estado}
            </p>
            <Link href="/reservar">
              <button type="button">Reservar</button>
            </Link>
          </article>
        );
      })}
    </main>
  );
}
