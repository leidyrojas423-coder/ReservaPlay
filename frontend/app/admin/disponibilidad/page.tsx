'use client';

import { useMemo, useState } from 'react';
import styles from './page.module.css';

type TipoCancha = 'Todas' | 'Futbol 5' | 'Futbol 7' | 'Multiproposito';
type EstadoDisponibilidad = 'Disponible' | 'Ocupado' | 'Mantenimiento';

type Slot = {
  hora: string;
  estado: EstadoDisponibilidad;
};

type Cancha = {
  nombre: string;
  tipo: Exclude<TipoCancha, 'Todas'>;
  ubicacion: string;
  estadoGeneral: EstadoDisponibilidad;
  slots: Slot[];
};

const horarios = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

const canchas: Cancha[] = [
  {
    nombre: 'Cancha Norte',
    tipo: 'Futbol 5',
    ubicacion: 'Sede Norte · césped premium',
    estadoGeneral: 'Disponible',
    slots: [
      { hora: '06:00', estado: 'Disponible' },
      { hora: '07:00', estado: 'Disponible' },
      { hora: '08:00', estado: 'Ocupado' },
      { hora: '09:00', estado: 'Ocupado' },
      { hora: '10:00', estado: 'Disponible' },
      { hora: '11:00', estado: 'Disponible' },
      { hora: '12:00', estado: 'Mantenimiento' },
      { hora: '13:00', estado: 'Mantenimiento' },
      { hora: '14:00', estado: 'Disponible' },
      { hora: '15:00', estado: 'Disponible' },
      { hora: '16:00', estado: 'Ocupado' },
      { hora: '17:00', estado: 'Disponible' },
      { hora: '18:00', estado: 'Disponible' },
      { hora: '19:00', estado: 'Ocupado' },
    ],
  },
  {
    nombre: 'Cancha Central',
    tipo: 'Futbol 7',
    ubicacion: 'Sede Central · gradería ligera',
    estadoGeneral: 'Ocupado',
    slots: [
      { hora: '06:00', estado: 'Disponible' },
      { hora: '07:00', estado: 'Disponible' },
      { hora: '08:00', estado: 'Disponible' },
      { hora: '09:00', estado: 'Ocupado' },
      { hora: '10:00', estado: 'Ocupado' },
      { hora: '11:00', estado: 'Ocupado' },
      { hora: '12:00', estado: 'Disponible' },
      { hora: '13:00', estado: 'Disponible' },
      { hora: '14:00', estado: 'Mantenimiento' },
      { hora: '15:00', estado: 'Mantenimiento' },
      { hora: '16:00', estado: 'Disponible' },
      { hora: '17:00', estado: 'Disponible' },
      { hora: '18:00', estado: 'Ocupado' },
      { hora: '19:00', estado: 'Ocupado' },
    ],
  },
  {
    nombre: 'Cancha Sur',
    tipo: 'Multiproposito',
    ubicacion: 'Complejo Sur · acceso controlado',
    estadoGeneral: 'Mantenimiento',
    slots: [
      { hora: '06:00', estado: 'Mantenimiento' },
      { hora: '07:00', estado: 'Mantenimiento' },
      { hora: '08:00', estado: 'Mantenimiento' },
      { hora: '09:00', estado: 'Disponible' },
      { hora: '10:00', estado: 'Disponible' },
      { hora: '11:00', estado: 'Disponible' },
      { hora: '12:00', estado: 'Ocupado' },
      { hora: '13:00', estado: 'Ocupado' },
      { hora: '14:00', estado: 'Disponible' },
      { hora: '15:00', estado: 'Disponible' },
      { hora: '16:00', estado: 'Disponible' },
      { hora: '17:00', estado: 'Ocupado' },
      { hora: '18:00', estado: 'Ocupado' },
      { hora: '19:00', estado: 'Disponible' },
    ],
  },
];

const statusMeta: Record<EstadoDisponibilidad, { label: string; className: string }> = {
  Disponible: { label: 'Disponible', className: styles.badgeDisponible },
  Ocupado: { label: 'Ocupado', className: styles.badgeOcupado },
  Mantenimiento: { label: 'Mantenimiento', className: styles.badgeMantenimiento },
};

export default function AdminDisponibilidadPage() {
  const [fecha, setFecha] = useState('2026-07-20');
  const [tipoCancha, setTipoCancha] = useState<TipoCancha>('Todas');

  const canchasFiltradas = useMemo(
    () => canchas.filter((cancha) => tipoCancha === 'Todas' || cancha.tipo === tipoCancha),
    [tipoCancha],
  );

  const totales = useMemo(() => {
    const slotsVisibles = canchasFiltradas.flatMap((cancha) => cancha.slots);
    return {
      disponibles: slotsVisibles.filter((slot) => slot.estado === 'Disponible').length,
      ocupados: slotsVisibles.filter((slot) => slot.estado === 'Ocupado').length,
      mantenimiento: slotsVisibles.filter((slot) => slot.estado === 'Mantenimiento').length,
    };
  }, [canchasFiltradas]);

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="disponibilidad-title">
        <div className={styles.hero__copy}>
          <p className={styles.eyebrow}>Consulta de disponibilidad</p>
          <h1 id="disponibilidad-title" className={styles.title}>
            Vista de Disponibilidad
          </h1>
          <p className={styles.description}>
            Una lectura visual clara para clientes y administradores, con bloques horarios y
            estados diferenciados por color sin alterar el sistema visual base de ReservaPlay.
          </p>
        </div>

        <div className={styles.summary} aria-label="Resumen de slots visibles">
          <article>
            <span>Disponibles</span>
            <strong>{totales.disponibles}</strong>
          </article>
          <article>
            <span>Ocupados</span>
            <strong>{totales.ocupados}</strong>
          </article>
          <article>
            <span>Mantenimiento</span>
            <strong>{totales.mantenimiento}</strong>
          </article>
        </div>
      </section>

      <section className={styles.panel} aria-labelledby="filtros-title">
        <div className={styles.panel__header}>
          <div>
            <p className={styles.panel__eyebrow}>Filtros rápidos</p>
            <h2 id="filtros-title" className={styles.panel__title}>
              Fecha y tipo de cancha
            </h2>
          </div>
          <p className={styles.panel__note}>
            Mock data visual únicamente. No hay peticiones a backend ni cambios globales.
          </p>
        </div>

        <div className={styles.filters}>
          <label className={styles.field}>
            <span>Fecha</span>
            <input type="date" value={fecha} onChange={(event) => setFecha(event.target.value)} />
          </label>

          <label className={styles.field}>
            <span>Tipo de cancha</span>
            <select value={tipoCancha} onChange={(event) => setTipoCancha(event.target.value as TipoCancha)}>
              <option value="Todas">Todas</option>
              <option value="Futbol 5">Futbol 5</option>
              <option value="Futbol 7">Futbol 7</option>
              <option value="Multiproposito">Multiproposito</option>
            </select>
          </label>

          <div className={styles.legend} aria-label="Leyenda de estados">
            <span className={styles.legend__item}>
              <i className={styles.legendDotDisponible} /> Disponible
            </span>
            <span className={styles.legend__item}>
              <i className={styles.legendDotOcupado} /> Ocupado
            </span>
            <span className={styles.legend__item}>
              <i className={styles.legendDotMantenimiento} /> Mantenimiento
            </span>
          </div>
        </div>
      </section>

      <section className={styles.panel} aria-labelledby="grid-title">
        <div className={styles.panel__header}>
          <div>
            <p className={styles.panel__eyebrow}>Timeline / Grid</p>
            <h2 id="grid-title" className={styles.panel__title}>
              {tipoCancha === 'Todas' ? 'Todas las canchas' : `Canchas ${tipoCancha}`}
            </h2>
          </div>
          <p className={styles.panel__note}>
            Fecha consultada: <strong>{fecha}</strong>
          </p>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.timelineTable} aria-label="Cuadrícula de disponibilidad">
            <thead>
              <tr>
                <th className={styles.stickyColumn}>Cancha</th>
                {horarios.map((hora) => (
                  <th key={hora}>{hora}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {canchasFiltradas.map((cancha) => (
                <tr key={cancha.nombre}>
                  <td className={styles.stickyColumn}>
                    <div className={styles.courtCell}>
                      <strong>{cancha.nombre}</strong>
                      <span>{cancha.tipo}</span>
                      <p>{cancha.ubicacion}</p>
                      <span className={`${styles.statusPill} ${statusMeta[cancha.estadoGeneral].className}`}>
                        {statusMeta[cancha.estadoGeneral].label}
                      </span>
                    </div>
                  </td>
                  {cancha.slots.map((slot) => {
                    const meta = statusMeta[slot.estado];

                    return (
                      <td key={`${cancha.nombre}-${slot.hora}`}>
                        <div className={`${styles.slotBadge} ${meta.className}`}>
                          <span className={styles.slotTime}>{slot.hora}</span>
                          <span>{meta.label}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.mobileList} aria-label="Lista móvil de disponibilidad">
          {canchasFiltradas.map((cancha) => (
            <article key={cancha.nombre} className={styles.card}>
              <div className={styles.card__head}>
                <div>
                  <p>{cancha.tipo}</p>
                  <h3>{cancha.nombre}</h3>
                </div>
                <span className={`${styles.statusPill} ${statusMeta[cancha.estadoGeneral].className}`}>
                  {statusMeta[cancha.estadoGeneral].label}
                </span>
              </div>

              <p className={styles.card__location}>{cancha.ubicacion}</p>

              <div className={styles.mobileSlots}>
                {cancha.slots.map((slot) => {
                  const meta = statusMeta[slot.estado];

                  return (
                    <div key={`${cancha.nombre}-${slot.hora}`} className={styles.mobileSlot}>
                      <div>
                        <strong>{slot.hora}</strong>
                        <span>{meta.label}</span>
                      </div>
                      <span className={`${styles.statusPill} ${meta.className}`}>{slot.estado}</span>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}