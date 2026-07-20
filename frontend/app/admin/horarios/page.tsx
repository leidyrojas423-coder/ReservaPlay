'use client';

import { useMemo, useState } from 'react';
import styles from './page.module.css';

type DayKey = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
type SlotStatus = 'Activo' | 'Bloqueado';

type Slot = {
  id: string;
  label: string;
  start: string;
  end: string;
  cancha: string;
  status: SlotStatus;
  note: string;
};

const days: DayKey[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const scheduleByDay: Record<DayKey, Slot[]> = {
  Lunes: [
    { id: 'L-01', label: 'Mañana 1', start: '06:00 AM', end: '07:00 AM', cancha: 'Cancha Norte', status: 'Activo', note: 'Bloque de apertura, ideal para reservas tempranas.' },
    { id: 'L-02', label: 'Mañana 2', start: '07:00 AM', end: '08:00 AM', cancha: 'Cancha Norte', status: 'Activo', note: 'Alta rotación con disponibilidad continua.' },
    { id: 'L-03', label: 'Media mañana', start: '10:00 AM', end: '11:00 AM', cancha: 'Cancha Central', status: 'Bloqueado', note: 'Reservado para mantenimiento preventivo.' },
    { id: 'L-04', label: 'Tarde 1', start: '04:00 PM', end: '05:00 PM', cancha: 'Cancha Sur', status: 'Activo', note: 'Ventana perfecta para partidos corporativos.' },
  ],
  Martes: [
    { id: 'M-01', label: 'Early', start: '06:00 AM', end: '07:00 AM', cancha: 'Cancha Oriente', status: 'Activo', note: 'Bloque de calentamiento con ritmo suave.' },
    { id: 'M-02', label: 'Prime Time', start: '06:00 PM', end: '07:00 PM', cancha: 'Cancha Central', status: 'Activo', note: 'Slot con mayor demanda del día.' },
    { id: 'M-03', label: 'Noche', start: '07:00 PM', end: '08:00 PM', cancha: 'Cancha Central', status: 'Bloqueado', note: 'Cerrado para reacomodo de agenda.' },
  ],
  Miércoles: [
    { id: 'X-01', label: 'Mañana', start: '07:00 AM', end: '08:00 AM', cancha: 'Cancha Norte', status: 'Activo', note: 'Apertura con baja ocupación.' },
    { id: 'X-02', label: 'Mediodía', start: '12:00 PM', end: '01:00 PM', cancha: 'Cancha Sur', status: 'Bloqueado', note: 'Bloque restringido por limpieza profunda.' },
    { id: 'X-03', label: 'Tarde', start: '03:00 PM', end: '04:00 PM', cancha: 'Cancha Oriente', status: 'Activo', note: 'Horario flexible para grupos pequeños.' },
  ],
  Jueves: [
    { id: 'J-01', label: 'Jornada 1', start: '08:00 AM', end: '09:00 AM', cancha: 'Cancha Central', status: 'Activo', note: 'Inicio de jornada con agenda ligera.' },
    { id: 'J-02', label: 'Jornada 2', start: '05:00 PM', end: '06:00 PM', cancha: 'Cancha Sur', status: 'Activo', note: 'Horario premium para equipos recurrentes.' },
    { id: 'J-03', label: 'Jornada 3', start: '09:00 PM', end: '10:00 PM', cancha: 'Cancha Norte', status: 'Bloqueado', note: 'Bloque cerrado por descanso operativo.' },
  ],
  Viernes: [
    { id: 'V-01', label: 'Amanecer', start: '06:00 AM', end: '07:00 AM', cancha: 'Cancha Oriente', status: 'Activo', note: 'Slot rápido para reservas de última hora.' },
    { id: 'V-02', label: 'After Office', start: '06:00 PM', end: '07:00 PM', cancha: 'Cancha Central', status: 'Activo', note: 'Franja más fuerte del fin de semana deportivo.' },
    { id: 'V-03', label: 'Noche', start: '08:00 PM', end: '09:00 PM', cancha: 'Cancha Sur', status: 'Bloqueado', note: 'Bloque temporalmente cerrado.' },
    { id: 'V-04', label: 'Cierre', start: '09:00 PM', end: '10:00 PM', cancha: 'Cancha Sur', status: 'Activo', note: 'Último slot del día con disponibilidad limitada.' },
  ],
  Sábado: [
    { id: 'S-01', label: 'Morning Match', start: '08:00 AM', end: '09:00 AM', cancha: 'Cancha Norte', status: 'Activo', note: 'Buen ritmo para torneos cortos.' },
    { id: 'S-02', label: 'Peak Match', start: '12:00 PM', end: '01:00 PM', cancha: 'Cancha Central', status: 'Bloqueado', note: 'Bloque bloqueado por ocupación total.' },
    { id: 'S-03', label: 'Sunset Match', start: '05:00 PM', end: '06:00 PM', cancha: 'Cancha Oriente', status: 'Activo', note: 'Horario recomendado para partidos amistosos.' },
  ],
  Domingo: [
    { id: 'D-01', label: 'Reinicio', start: '09:00 AM', end: '10:00 AM', cancha: 'Cancha Sur', status: 'Activo', note: 'Bloque ligero para programación dominical.' },
    { id: 'D-02', label: 'Mediodía', start: '12:00 PM', end: '01:00 PM', cancha: 'Cancha Norte', status: 'Activo', note: 'Ideal para encuentros familiares.' },
    { id: 'D-03', label: 'Cierre', start: '06:00 PM', end: '07:00 PM', cancha: 'Cancha Central', status: 'Bloqueado', note: 'Cierre de operación y mantenimiento.' },
  ],
};

const statusMeta: Record<SlotStatus, { label: string; className: string; dotClassName: string }> = {
  Activo: {
    label: 'Activo / Habilitado',
    className: styles.badgeActive,
    dotClassName: styles.dotActive,
  },
  Bloqueado: {
    label: 'Bloqueado / Desactivado',
    className: styles.badgeBlocked,
    dotClassName: styles.dotBlocked,
  },
};

export default function AdminHorariosPage() {
  const [selectedDay, setSelectedDay] = useState<DayKey>('Lunes');

  const slots = useMemo(() => scheduleByDay[selectedDay], [selectedDay]);

  const activeCount = slots.filter((slot) => slot.status === 'Activo').length;
  const blockedCount = slots.filter((slot) => slot.status === 'Bloqueado').length;

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="horarios-title">
        <div className={styles.hero__copy}>
          <p className={styles.eyebrow}>Administración</p>
          <h1 id="horarios-title" className={styles.title}>
            Gestión de Horarios
          </h1>
          <p className={styles.description}>
            Vista visual de referencia para administrar bloques de tiempo por cancha con una
            estética deportiva limpia, moderna y totalmente alineada con el diseño base.
          </p>
        </div>

        <div className={styles.scoreboard} aria-label="Resumen de estado de horarios">
          <div className={styles.scoreboard__item}>
            <span>Día activo</span>
            <strong>{selectedDay}</strong>
          </div>
          <div className={styles.scoreboard__stats}>
            <article>
              <span>Activos</span>
              <strong>{activeCount}</strong>
            </article>
            <article>
              <span>Bloqueados</span>
              <strong>{blockedCount}</strong>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.panel} aria-labelledby="days-title">
        <div className={styles.panel__header}>
          <div>
            <p className={styles.panel__eyebrow}>Selector semanal</p>
            <h2 id="days-title" className={styles.panel__title}>
              Días de la semana
            </h2>
          </div>
          <div className={styles.legend} aria-label="Leyenda de estados">
            <span className={styles.legend__item}>
              <i className={styles.dotActive} /> Activo / Habilitado
            </span>
            <span className={styles.legend__item}>
              <i className={styles.dotBlocked} /> Bloqueado / Desactivado
            </span>
          </div>
        </div>

        <div className={styles.dayTabs} role="tablist" aria-label="Días de la semana">
          {days.map((day) => {
            const isSelected = day === selectedDay;
            return (
              <button
                key={day}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`${styles.dayTab} ${isSelected ? styles.dayTabActive : ''}`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.panel} aria-labelledby="slots-title">
        <div className={styles.panel__header}>
          <div>
            <p className={styles.panel__eyebrow}>Bloques de tiempo</p>
            <h2 id="slots-title" className={styles.panel__title}>
              Horarios para {selectedDay}
            </h2>
          </div>
          <p className={styles.panel__note}>
            Mock data únicamente. Los botones son decorativos y no ejecutan acciones reales.
          </p>
        </div>

        <div className={styles.grid} aria-label={`Bloques horarios de ${selectedDay}`}>
          {slots.map((slot) => {
            const meta = statusMeta[slot.status];

            return (
              <article key={slot.id} className={styles.slotCard}>
                <div className={styles.slotCard__top}>
                  <div>
                    <p className={styles.slotCard__label}>{slot.label}</p>
                    <h3 className={styles.slotCard__time}>
                      {slot.start} - {slot.end}
                    </h3>
                  </div>
                  <span className={`${styles.badge} ${meta.className}`}>
                    <span className={`${styles.badge__dot} ${meta.dotClassName}`} />
                    {meta.label}
                  </span>
                </div>

                <div className={styles.slotCard__meta}>
                  <div>
                    <span>Cancha</span>
                    <strong>{slot.cancha}</strong>
                  </div>
                  <div>
                    <span>Bloque</span>
                    <strong>{slot.id}</strong>
                  </div>
                </div>

                <p className={styles.slotCard__note}>{slot.note}</p>

                <div className={styles.slotCard__actions}>
                  <button type="button" className={styles.actionPrimary}>
                    Editar Horario
                  </button>
                  <button type="button" className={styles.actionSecondary}>
                    Bloquear Bloque
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}