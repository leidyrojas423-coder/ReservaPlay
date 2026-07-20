'use client';

import styles from './page.module.css';

type PasoReserva = 'Seleccionar' | 'Confirmar' | 'Finalizar';

type ResumenReserva = {
  cancha: string;
  fecha: string;
  hora: string;
  tipo: string;
  estado: string;
};

const pasos: PasoReserva[] = ['Seleccionar', 'Confirmar', 'Finalizar'];

const resumen: ResumenReserva = {
  cancha: 'Cancha 1',
  fecha: 'Hoy · 20 Jul 2026',
  hora: '7:00 PM - 8:00 PM',
  tipo: 'Futbol 5',
  estado: 'Pendiente',
};

const datosCliente = [
  { label: 'Nombre del cliente', value: 'Carlos Mendoza' },
  { label: 'Teléfono', value: '+57 300 123 4567' },
  { label: 'Correo', value: 'carlos.mendoza@mail.com' },
];

const detallesPrecio = [
  { concepto: 'Tarifa base', valor: '$120.000' },
  { concepto: 'Servicio administrativo', valor: '$8.000' },
  { concepto: 'Ajuste premium cancha', valor: '$12.000' },
];

export default function MisReservasPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="reserva-title">
        <div className={styles.hero__copy}>
          <p className={styles.eyebrow}>Reserva de cliente</p>
          <h1 id="reserva-title" className={styles.title}>
            Crear Reserva
          </h1>
          <p className={styles.description}>
            Una experiencia visual limpia y premium para iniciar una reserva sobre un horario
            disponible, con guiños deportivos sutiles y un flujo claro de confirmación.
          </p>
        </div>

        <div className={styles.summaryCard} aria-label="Resumen de la reserva seleccionada">
          <div className={styles.summaryCard__statusRow}>
            <span className={styles.statusBadge}>{resumen.estado}</span>
            <span className={styles.statusNote}>Reserva lista para confirmar</span>
          </div>

          <div className={styles.summaryCard__items}>
            <article>
              <span>Cancha</span>
              <strong>{resumen.cancha}</strong>
            </article>
            <article>
              <span>Fecha</span>
              <strong>{resumen.fecha}</strong>
            </article>
            <article>
              <span>Horario</span>
              <strong>{resumen.hora}</strong>
            </article>
            <article>
              <span>Tipo</span>
              <strong>{resumen.tipo}</strong>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.panel} aria-labelledby="stepper-title">
        <div className={styles.panel__header}>
          <div>
            <p className={styles.panel__eyebrow}>Flujo de reserva</p>
            <h2 id="stepper-title" className={styles.panel__title}>
              Paso a paso
            </h2>
          </div>
          <p className={styles.panel__note}>
            Mock data únicamente. No hay peticiones reales ni lógica de persistencia.
          </p>
        </div>

        <div className={styles.stepper} aria-label="Pasos del proceso de reserva">
          {pasos.map((paso, index) => (
            <div key={paso} className={styles.step}>
              <span className={styles.step__number}>{index + 1}</span>
              <div>
                <strong>{paso}</strong>
                <p>
                  {index === 0
                    ? 'Escoge cancha, fecha y horario.'
                    : index === 1
                      ? 'Revisa tus datos y el precio.'
                      : 'Confirma la reserva y deja todo listo.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.contentGrid}>
        <section className={styles.panel} aria-labelledby="form-title">
          <div className={styles.panel__header}>
            <div>
              <p className={styles.panel__eyebrow}>Datos requeridos</p>
              <h2 id="form-title" className={styles.panel__title}>
                Información del cliente
              </h2>
            </div>
          </div>

          <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
            <div className={styles.form__grid}>
              <label className={styles.field}>
                <span>Nombre del cliente</span>
                <input type="text" value={datosCliente[0].value} readOnly />
              </label>

              <label className={styles.field}>
                <span>Teléfono</span>
                <input type="tel" value={datosCliente[1].value} readOnly />
              </label>

              <label className={styles.field}>
                <span>Correo</span>
                <input type="email" value={datosCliente[2].value} readOnly />
              </label>

              <label className={styles.field}>
                <span>Selección de usuario</span>
                <select defaultValue="Carlos Mendoza">
                  <option>Carlos Mendoza</option>
                  <option>Laura Rojas</option>
                  <option>Andrés Toro</option>
                </select>
              </label>

              <label className={`${styles.field} ${styles.fieldWide}`}>
                <span>Observaciones</span>
                <textarea
                  rows={4}
                  defaultValue="Reserva recreativa de ejemplo para una jornada premium con acceso anticipado."
                />
              </label>
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.primaryAction}>
                Confirmar Reserva
              </button>
              <button type="button" className={styles.secondaryAction}>
                Cancelar
              </button>
            </div>
          </form>
        </section>

        <aside className={styles.sideColumn}>
          <section className={styles.panel} aria-labelledby="price-title">
            <div className={styles.panel__header}>
              <div>
                <p className={styles.panel__eyebrow}>Desglose</p>
                <h2 id="price-title" className={styles.panel__title}>
                  Precio y método de pago
                </h2>
              </div>
            </div>

            <div className={styles.priceCard}>
              {detallesPrecio.map((item) => (
                <div key={item.concepto} className={styles.priceRow}>
                  <span>{item.concepto}</span>
                  <strong>{item.valor}</strong>
                </div>
              ))}

              <div className={styles.priceTotal}>
                <span>Total estimado</span>
                <strong>$140.000</strong>
              </div>
            </div>

            <div className={styles.paymentBox}>
              <p>Método de pago simulado</p>
              <div className={styles.paymentChipRow}>
                <span className={styles.paymentChip}>Tarjeta</span>
                <span className={styles.paymentChip}>Transferencia</span>
                <span className={styles.paymentChip}>Billetera</span>
              </div>
            </div>
          </section>

          <section className={styles.panel} aria-labelledby="preview-title">
            <div className={styles.panel__header}>
              <div>
                <p className={styles.panel__eyebrow}>Vista rápida</p>
                <h2 id="preview-title" className={styles.panel__title}>
                  Confirmación visual
                </h2>
              </div>
            </div>

            <div className={styles.previewCard}>
              <div className={styles.previewCard__top}>
                <span className={styles.statusBadge}>Pendiente</span>
                <span className={styles.previewCard__label}>Reserva activa</span>
              </div>

              <h3>{resumen.cancha}</h3>
              <p>{resumen.fecha}</p>
              <p>{resumen.hora}</p>

              <div className={styles.previewCard__footer}>
                <span>Estado inicial</span>
                <strong>La reserva se crea en Pendiente</strong>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}