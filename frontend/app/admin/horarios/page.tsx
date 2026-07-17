'use client';

import { useEffect, useState } from 'react';

interface Horario {
  id: string;
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  canchaId?: string;
}

export default function AdminHorariosPage() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    canchaId: '',
    fechaInicio: '',
    fechaFin: '',
    activo: true,
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('reservaplay_token') : null;

  const cargarHorarios = async () => {
    if (!token) {
      setError('Debe iniciar sesión como administrador.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/horarios', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'No se pudieron cargar los horarios');
      }

      const data = await response.json();
      setHorarios(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHorarios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Debe iniciar sesión como administrador.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/horarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: form.nombre,
          descripcion: form.descripcion,
          canchaId: form.canchaId,
          fechaInicio: form.fechaInicio,
          fechaFin: form.fechaFin,
          activo: form.activo,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'No se pudo crear el horario');
      }

      setSuccess('Horario creado correctamente');
      setForm({
        nombre: '',
        descripcion: '',
        canchaId: '',
        fechaInicio: '',
        fechaFin: '',
        activo: true,
      });
      await cargarHorarios();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    }
  };

  return (
    <main style={{ maxWidth: 1200, margin: '40px auto', padding: 24 }}>
      <h1>Gestión de Horarios</h1>
      <p>Administra los bloques de horario por cancha.</p>

      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      {success ? <p style={{ color: 'green' }}>{success}</p> : null}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
        <input
          placeholder="Nombre del horario"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          required
        />
        <input
          placeholder="Descripción"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
        />
        <input
          placeholder="Cancha ID"
          value={form.canchaId}
          onChange={(e) => setForm({ ...form, canchaId: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          value={form.fechaInicio}
          onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          value={form.fechaFin}
          onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={form.activo}
            onChange={(e) => setForm({ ...form, activo: e.target.checked })}
          />
          Activo
        </label>
        <button type="submit" style={{ maxWidth: 200 }}>
          Crear Horario
        </button>
      </form>

      {loading ? (
        <p>Cargando horarios...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Nombre</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Inicio</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Fin</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Activo</th>
            </tr>
          </thead>
          <tbody>
            {horarios.map((horario) => (
              <tr key={horario.id}>
                <td style={{ padding: 8 }}>{horario.nombre}</td>
                <td style={{ padding: 8 }}>{horario.fechaInicio}</td>
                <td style={{ padding: 8 }}>{horario.fechaFin}</td>
                <td style={{ padding: 8 }}>{horario.activo ? 'Sí' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
