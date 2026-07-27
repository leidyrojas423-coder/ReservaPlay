'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './horarios.module.css';
import {
  actualizarHorario,
  crearHorario,
  desactivarHorario,
  listarCanchas,
  listarHorarios,
  type AdminCancha,
  type AdminHorario,
} from '../../../services/admin.service';

type FormHorario = {
  nombre: string;
  descripcion: string;
  canchaId: string;
  fechaInicio: string;
  fechaFin: string;
};

const initialForm: FormHorario = {
  nombre: '',
  descripcion: '',
  canchaId: '',
  fechaInicio: '',
  fechaFin: '',
};

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export default function AdminHorariosPage() {
  const [horarios, setHorarios] = useState<AdminHorario[]>([]);
  const [canchas, setCanchas] = useState<AdminCancha[]>([]);
  const [form, setForm] = useState<FormHorario>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError('');
      const [canchasData, horariosData] = await Promise.all([listarCanchas(), listarHorarios()]);
      setCanchas(canchasData);
      setHorarios(horariosData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los horarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargarDatos();
  }, []);

  const activos = useMemo(() => horarios.filter((horario) => horario.activo !== false).length, [horarios]);

  const canchaPorId = useMemo(
    () => Object.fromEntries(canchas.map((cancha) => [cancha.id, cancha.nombre])),
    [canchas],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.fechaInicio >= form.fechaFin) {
      setError('La fecha inicial debe ser menor a la fecha final.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      await crearHorario({ ...form, activo: true });
      setForm(initialForm);
      setMessage('Horario creado correctamente.');
      await cargarDatos();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo crear el horario.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (horario: AdminHorario) => {
    setError('');
    setMessage('');

    try {
      if (horario.activo === false) {
        await actualizarHorario(horario.id, {
          nombre: horario.nombre,
          descripcion: horario.descripcion,
          fechaInicio: horario.fechaInicio,
          fechaFin: horario.fechaFin,
          canchaId: horario.canchaId,
          activo: true,
        });
        setMessage(`Horario ${horario.nombre} reactivado.`);
      } else {
        await desactivarHorario(horario.id);
        setMessage(`Horario ${horario.nombre} enviado a mantenimiento operativo.`);
      }

      await cargarDatos();
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'No se pudo actualizar el horario.');
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Gestión de horarios</p>
          <h2>Agenda operativa por cancha</h2>
          <p>Configura franjas disponibles y bloquea horarios cuando una cancha esté fuera de servicio.</p>
        </div>

        <div className={styles.stats}>
          <div>
            <span>Total horarios</span>
            <strong>{horarios.length}</strong>
          </div>
          <div>
            <span>Activos</span>
            <strong>{activos}</strong>
          </div>
          <div>
            <span>Bloqueados</span>
            <strong>{horarios.length - activos}</strong>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.sectionHeader}>
            <h3>Nuevo horario</h3>
            <p>Asocia la franja a una cancha disponible.</p>
          </div>

          <div className={styles.formGrid}>
            <input name="nombre" placeholder="Nombre del bloque" value={form.nombre} onChange={handleChange} required />
            <select name="canchaId" value={form.canchaId} onChange={handleChange} required>
              <option value="">Selecciona una cancha</option>
              {canchas.map((cancha) => (
                <option key={cancha.id} value={cancha.id}>
                  {cancha.nombre}
                </option>
              ))}
            </select>
            <input name="fechaInicio" type="datetime-local" value={form.fechaInicio} onChange={handleChange} required />
            <input name="fechaFin" type="datetime-local" value={form.fechaFin} onChange={handleChange} required />
            <textarea name="descripcion" placeholder="Notas del horario" value={form.descripcion} onChange={handleChange} rows={4} />
          </div>

          <button type="submit" className={styles.primaryButton} disabled={saving}>
            {saving ? 'Guardando...' : 'Crear horario'}
          </button>

          {error ? <p className={styles.error}>{error}</p> : null}
          {message ? <p className={styles.success}>{message}</p> : null}
        </form>

        <div className={styles.panel}>
          <div className={styles.sectionHeader}>
            <h3>Bloques registrados</h3>
            <p>Activa o bloquea horarios según operación diaria.</p>
          </div>

          {loading ? <p className={styles.empty}>Cargando horarios...</p> : null}

          {!loading && horarios.length === 0 ? <p className={styles.empty}>No hay horarios creados.</p> : null}

          <div className={styles.list}>
            {horarios.map((horario) => (
              <article key={horario.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <h4>{horario.nombre}</h4>
                    <p>{horario.cancha?.nombre ?? canchaPorId[horario.canchaId] ?? 'Cancha no disponible'}</p>
                  </div>
                  <span className={horario.activo === false ? styles.statusOff : styles.statusOn}>
                    {horario.activo === false ? 'Bloqueado' : 'Activo'}
                  </span>
                </div>

                <dl className={styles.meta}>
                  <div>
                    <dt>Inicio</dt>
                    <dd>{formatDateTime(horario.fechaInicio)}</dd>
                  </div>
                  <div>
                    <dt>Fin</dt>
                    <dd>{formatDateTime(horario.fechaFin)}</dd>
                  </div>
                </dl>

                <p className={styles.description}>{horario.descripcion || 'Sin notas operativas.'}</p>

                <button type="button" className={styles.secondaryButton} onClick={() => void handleToggle(horario)}>
                  {horario.activo === false ? 'Reactivar horario' : 'Bloquear horario'}
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}