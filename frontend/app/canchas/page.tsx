"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { obtenerCanchas } from "../../services/canchas.service";
import styles from "./canchas.module.css";

type Cancha = {
  id?: string | number;
  _id?: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  capacidad: number;
  precio: number;
  estado: string;
};

type CanchasResponse = Cancha[] | { data: Cancha[] };


export default function CanchasPage() {
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCanchas = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await obtenerCanchas();
        const payload = response?.data as CanchasResponse;
        const data = Array.isArray(payload) ? payload : payload?.data;

        setCanchas(Array.isArray(data) ? data : []);
      } catch {
        setError("Error de conexión. No se pudieron cargar las canchas.");
      } finally {
        setLoading(false);
      }
    };

    void fetchCanchas();
  }, []);

  if (loading) {
    return (
      <main className={styles.container}>
        <h1>Canchas</h1>
        <p className={styles.message}>Cargando...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.container}>
        <h1>Canchas</h1>
        <p className={styles.error}>{error}</p>
      </main>
    );
  }

  if (canchas.length === 0) {
    return (
      <main className={styles.container}>
        <h1>Canchas</h1>
        <p className={styles.message}>No hay canchas disponibles.</p>
      </main>
    );
  }

  return (
    <main className={styles.container}>

      <h1>Canchas</h1>


      <div className={styles.grid}>

        {canchas.map((cancha) => (
          <div
            key={String(cancha._id ?? cancha.id ?? cancha.nombre)}
            className={styles.card}
          >
            <h2>{cancha.nombre}</h2>
            <p><strong>Descripción:</strong> {cancha.descripcion}</p>
            <p><strong>Ubicación:</strong> {cancha.ubicacion}</p>
            <p><strong>Precio:</strong> {cancha.precio}</p>
            <p><strong>Estado:</strong> {cancha.estado}</p>

            {String(cancha._id ?? cancha.id ?? "") && (
              <Link href={`/canchas/${String(cancha._id ?? cancha.id)}`}>
                <button type="button">Ver horarios</button>
              </Link>
            )}
          </div>

        ))}

      </div>

    </main>
  );
}