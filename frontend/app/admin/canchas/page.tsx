'use client';

import styles from './page.module.css';

type EstadoCancha = 'Disponible' | 'Ocupada' | 'Mantenimiento';

type CanchaMock = {
  id: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  estado: EstadoCancha;
  precio: string;
};

const canchas: CanchaMock[] = [
  {
    id: 'CAN-001',
    nombre: 'Cancha Sintética Norte',
    descripcion: 'Césped sintético de alto tráfico con iluminación nocturna y gradería lateral.',
    ubicacion: 'Sede Norte, bloque A',
    estado: 'Disponible',
    precio: '$120.000',
  },
  {
    id: 'CAN-002',
    nombre: 'Cancha Multipropósito Central',
    descripcion: 'Espacio adaptable para fútbol 5, microfútbol y eventos deportivos internos.',
    ubicacion: 'Sede Central, nivel 1',
    estado: 'Ocupada',
    precio: '$145.000',
  },
  {
    id: 'CAN-003',
    nombre: 'Cancha Premium Sur',
    descripcion: 'Superficie premium con cerramiento completo y zona de hidratación cercana.',
    ubicacion: 'Sede Sur, módulo deportivo',
    estado: 'Mantenimiento',
    precio: '$180.000',
  },
  {
    id: 'CAN-004',
    nombre: 'Cancha Mixta Oriente',
    descripcion: 'Perfecta para reservas rápidas de grupos pequeños con acceso controlado.',
    ubicacion: 'Sede Oriente, acceso principal',
    estado: 'Disponible',
    precio: '$110.000',
  },
];

const estadoMetadata: Record<EstadoCancha, { label: string; className: string }> = {
  Disponible: { label: 'Disponible', className: styles.badgeDisponible },
  Ocupada: { label: 'Ocupada', className: styles.badgeOcupada },
  Mantenimiento: { label: 'Mantenimiento', className: styles.badgeMantenimiento },
};

const resumen = {
  total: canchas.length,
  disponibles: canchas.filter((cancha) => cancha.estado === 'Disponible').length,
  ocupadas: canchas.filter((cancha) => cancha.estado === 'Ocupada').length,
  mantenimiento: canchas.filter((cancha) => cancha.estado === 'Mantenimiento').length,
};

export default function AdminCanchasPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="gestion-canchas-title">
        <div className={styles.hero__copy}>
          <p className={styles.eyebrow}>Administración</p>
          <h1 id="gestion-canchas-title" className={styles.title}>
            Gestión de Canchas
          </h1>
          <p className={styles.description}>
            Vista visual de ejemplo para revisar el catálogo de canchas con sus estados,
            ubicación y precio, respetando el layout base de ReservaPlay.
          </p>
        </div>

        <div className={styles.hero__summary} aria-label="Resumen de canchas">
          <article>
            <span>Total</span>
            <strong>{resumen.total}</strong>
          </article>
          <article>
            <span>Disponibles</span>
            <strong>{resumen.disponibles}</strong>
          </article>
          <article>
            <span>Ocupadas</span>
            <strong>{resumen.ocupadas}</strong>
          </article>
          <article>
            <span>Mantenimiento</span>
            <strong>{resumen.mantenimiento}</strong>
          </article>
        </div>
      </section>

      <section className={styles.panel} aria-labelledby="canchas-table-title">
        <div className={styles.panel__header}>
          <div>
            <p className={styles.panel__eyebrow}>Listado de referencia</p>
            <h2 id="canchas-table-title" className={styles.panel__title}>
              Canchas registradas
            </h2>
          </div>
          <p className={styles.panel__note}>
            Mock data únicamente. No hay llamadas a API ni lógica de persistencia.
          </p>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table} aria-label="Tabla de gestión de canchas">
            <thead>
              <tr>
                <th>Nombre de cancha</th>
                <th>Descripción</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {canchas.map((cancha) => {
                const meta = estadoMetadata[cancha.estado];

                return (
                  <tr key={cancha.id}>
                    <td>
                      <div className={styles.primaryCell}>
                        <strong>{cancha.nombre}</strong>
                        <span>{cancha.id}</span>
                      </div>
                    </td>
                    <td>{cancha.descripcion}</td>
                    <td>{cancha.ubicacion}</td>
                    <td>
                      <span className={`${styles.badge} ${meta.className}`}>{meta.label}</span>
                    </td>
                    <td>{cancha.precio}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={styles.mobileCards} aria-label="Tarjetas de canchas">
          {canchas.map((cancha) => {
            const meta = estadoMetadata[cancha.estado];

            return (
              <article key={cancha.id} className={styles.card}>
                <div className={styles.card__head}>
                  <div>
                    <p>{cancha.id}</p>
                    <h3>{cancha.nombre}</h3>
                  </div>
                  <span className={`${styles.badge} ${meta.className}`}>{meta.label}</span>
                </div>

                <p className={styles.card__description}>{cancha.descripcion}</p>

                <dl className={styles.card__meta}>
                  <div>
                    <dt>Ubicación</dt>
                    <dd>{cancha.ubicacion}</dd>
                  </div>
                  <div>
                    <dt>Precio</dt>
                    <dd>{cancha.precio}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}