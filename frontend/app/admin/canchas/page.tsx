'use client';

import { useEffect, useState } from 'react';
import { getStoredAuthToken } from '../../../lib/auth';

interface Cancha {
  id: string;
  nombre: string;
  descripcion?: string;
  ubicacion: string;
  estado: string;
  capacidad?: number;
  precio?: number;
  activo: boolean;
  administradorId?: string;
}

export default function AdminCanchasPage() {
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    ubicacion: '',
    estado: 'Disponible',
    capacidad: '',
    precio: '',
    administradorId: '',
    activo: true,
  });

  const token = getStoredAuthToken();

  const cargarCanchas = async () => {
    if (!token) {
      setError('Debe iniciar sesión como administrador.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/canchas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'No se pudieron cargar las canchas');
      }

      const data = await response.json();
      setCanchas(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCanchas();
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
      const response = await fetch('http://localhost:3000/canchas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: form.nombre,
          descripcion: form.descripcion,
          ubicacion: form.ubicacion,
          estado: form.estado,
          capacidad: form.capacidad ? Number(form.capacidad) : undefined,
          precio: form.precio ? Number(form.precio) : undefined,
          administradorId: form.administradorId,
          activo: form.activo,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'No se pudo crear la cancha');
      }

      setSuccess('Cancha creada correctamente');
      setForm({
        nombre: '',
        descripcion: '',
        ubicacion: '',
        estado: 'Disponible',
        capacidad: '',
        precio: '',
        administradorId: '',
        activo: true,
      });
      await cargarCanchas();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    }
  };

  return (
    <main style={{ maxWidth: 1200, margin: '40px auto', padding: 24 }}>
      <h1>Gestión de Canchas</h1>
      <p>Administra las canchas disponibles para reservas.</p>

      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      {success ? <p style={{ color: 'green' }}>{success}</p> : null}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
        <input
          placeholder="Nombre de la cancha"
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
          placeholder="Ubicación"
          value={form.ubicacion}
          onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
          required
        />
        <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
          <option value="Disponible">Disponible</option>
          <option value="Ocupada">Ocupada</option>
          <option value="Mantenimiento">Mantenimiento</option>
        </select>
        <input
          type="number"
          placeholder="Capacidad"
          value={form.capacidad}
          onChange={(e) => setForm({ ...form, capacidad: e.target.value })}
        />
        <input
          type="number"
          placeholder="Precio"
          value={form.precio}
          onChange={(e) => setForm({ ...form, precio: e.target.value })}
        />
        <input
          placeholder="Administrador ID"
          value={form.administradorId}
          onChange={(e) => setForm({ ...form, administradorId: e.target.value })}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={form.activo}
            onChange={(e) => setForm({ ...form, activo: e.target.checked })}
          />
          Activa
        </label>
        <button type="submit" style={{ maxWidth: 220 }}>
          Crear Cancha
        </button>
      </form>

      {loading ? (
        <p>Cargando canchas...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Nombre</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Ubicación</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Estado</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Capacidad</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Precio</th>
            </tr>
          </thead>
          <tbody>
            {canchas.map((cancha) => (
              <tr key={cancha.id}>
                <td style={{ padding: 8 }}>{cancha.nombre}</td>
                <td style={{ padding: 8 }}>{cancha.ubicacion}</td>
                <td style={{ padding: 8 }}>{cancha.estado}</td>
                <td style={{ padding: 8 }}>{cancha.capacidad ?? '-'}</td>
                <td style={{ padding: 8 }}>{cancha.precio ?? '-'}</td>
              </tr>
            ))}
          </tbody>
          </table>
)}
    </main>
  );
}