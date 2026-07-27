"use client";

import { useEffect, useState } from "react";
import styles from "./mis-reservas.module.css";
import { obtenerMisReservas } from "../../services/reservas.service";
import { obtenerCanchas, type Cancha } from "../../services/canchas.service";
import {
    obtenerHorariosPorCancha,
    type Horario
} from "../../services/horarios.service";

interface HorarioApi {
    horaInicio?: string;
    horaFin?: string;
    nombre?: string;
    label?: string;
}

interface ReservaApi {
    id: number | string;
    canchaId?: string;
    cancha?: { nombre?: string } | string;
    horarioId?: string;
    fechaReserva?: string;
    fecha?: string;
    horario?: HorarioApi | string;
    estado?: string;
}

type CanchaPorId = Record<string, string>;
type HorarioPorId = Record<string, Horario>;

const normalizarReservas = (payload: unknown): ReservaApi[] => {
    if (Array.isArray(payload)) {
        return payload as ReservaApi[];
    }

    if (payload && typeof payload === "object") {
        const obj = payload as Record<string, unknown>;

        if (Array.isArray(obj.data)) {
            return obj.data as ReservaApi[];
        }

        if (Array.isArray(obj.reservas)) {
            return obj.reservas as ReservaApi[];
        }
    }

    return [];
};

const formatearFecha = (valor?: string) => {
    if (!valor) {
        return "Fecha no disponible";
    }

    const fecha = new Date(valor);

    if (Number.isNaN(fecha.getTime())) {
        return valor;
    }

    return fecha.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};

const obtenerHora = (valor?: string) => {
    if (!valor) {
        return null;
    }

    const fecha = new Date(valor);

    if (!Number.isNaN(fecha.getTime())) {
        return fecha.toLocaleTimeString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
    }

    if (valor.length >= 5) {
        return valor.slice(0, 5);
    }

    return valor;
};

const construirHorario = (horario?: Horario) => {
    if (!horario) {
        return "Horario no disponible";
    }

    const inicio = obtenerHora(horario.fechaInicio);
    const fin = obtenerHora(horario.fechaFin);

    if (inicio && fin) {
        return `${inicio} - ${fin}`;
    }

    return horario.nombre ?? "Horario no disponible";
};


export default function MisReservasPage(){
        const [reservas, setReservas] = useState<ReservaApi[]>([]);
    const [canchasPorId, setCanchasPorId] = useState<CanchaPorId>({});
    const [horariosPorId, setHorariosPorId] = useState<HorarioPorId>({});
        const [cargando, setCargando] = useState(true);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
                let activo = true;

                const cargarReservas = async () => {
                        try {
                                setCargando(true);
                                setError(null);

                                const data = await obtenerMisReservas();

                                if (!activo) {
                                        return;
                                }

                                const reservasNormalizadas = normalizarReservas(data);
                                setReservas(reservasNormalizadas);

                                const canchasResponse = await obtenerCanchas();

                                if (!activo) {
                                    return;
                                }

                                const canchasLista: Cancha[] = Array.isArray(canchasResponse)
                                    ? canchasResponse
                                    : Array.isArray((canchasResponse as { data?: Cancha[] }).data)
                                        ? (canchasResponse as { data: Cancha[] }).data
                                        : [];

                                const nuevoMapaCanchas = canchasLista.reduce<CanchaPorId>((acc, cancha) => {
                                    acc[cancha.id] = cancha.nombre;
                                    return acc;
                                }, {});

                                setCanchasPorId(nuevoMapaCanchas);

                                const canchaIds = Array.from(
                                    new Set(
                                        reservasNormalizadas
                                            .map((reserva) => reserva.canchaId)
                                            .filter((id): id is string => Boolean(id))
                                    )
                                );

                                const horariosPorCancha = await Promise.all(
                                    canchaIds.map(async (canchaId) => {
                                        try {
                                            const horarios = await obtenerHorariosPorCancha(canchaId);
                                            return horarios;
                                        } catch {
                                            return [] as Horario[];
                                        }
                                    })
                                );

                                if (!activo) {
                                    return;
                                }

                                const nuevoMapaHorarios = horariosPorCancha
                                    .flat()
                                    .reduce<HorarioPorId>((acc, horario) => {
                                        acc[horario.id] = horario;
                                        return acc;
                                    }, {});

                                setHorariosPorId(nuevoMapaHorarios);
                        } catch {
                                if (!activo) {
                                        return;
                                }

                                setError("No se pudieron cargar tus reservas.");
                                setReservas([]);
                                setCanchasPorId({});
                                setHorariosPorId({});
                        } finally {
                                if (activo) {
                                        setCargando(false);
                                }
                        }
                };

                void cargarReservas();

                return () => {
                        activo = false;
                };
        }, []);

        if (cargando) {
                return (
                        <main className={styles.container}>
                                <h1>Mis Reservas</h1>
                                <p>Cargando reservas...</p>
                        </main>
                );
        }

        if (error) {
                return (
                        <main className={styles.container}>
                                <h1>Mis Reservas</h1>
                                <p>{error}</p>
                        </main>
                );
        }

    return (

        <main className={styles.container}>

            <h1>
                Mis Reservas
            </h1>


            <section className={styles.lista}>

                {
                    reservas.length === 0 && (
                        <p>No tienes reservas registradas.</p>
                    )
                }

                {
                    reservas.map((reserva, index)=>(

                        (() => {
                            const cancha = reserva.canchaId
                                ? canchasPorId[reserva.canchaId] ?? "Cancha no disponible"
                                : "Cancha no disponible";

                            const fecha = formatearFecha(reserva.fechaReserva ?? reserva.fecha);
                            const horario = reserva.horarioId
                                ? construirHorario(horariosPorId[reserva.horarioId])
                                : "Horario no disponible";
                            const estado = reserva.estado ?? "Sin estado";

                            return (
                                <article
                                    key={reserva.id ?? index}
                                    className={styles.card}
                                >

                                    <h2>
                                        {cancha}
                                    </h2>


                                    <p>
                                        Fecha: {fecha}
                                    </p>


                                    <p>
                                        Horario: {horario}
                                    </p>


                                    <p>
                                        Estado:
                                        <strong>
                                            {" "}{estado}
                                        </strong>
                                    </p>


                                </article>
                            );
                        })()

                    ))
                }

            </section>


        </main>

    );
}