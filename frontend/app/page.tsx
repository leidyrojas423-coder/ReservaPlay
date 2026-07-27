import Link from "next/link";
import styles from "./page.module.css";

const beneficios = [
  {
    title: "Canchas de calidad",
    description: "Espacios modernos, bien mantenidos y listos para partidos intensos en cualquier momento.",
  },
  {
    title: "Disponibilidad en tiempo real",
    description: "Consulta horarios actualizados y reserva sin llamadas ni procesos manuales.",
  },
  {
    title: "Fácil y rápido",
    description: "Encuentra tu cancha, selecciona horario y confirma la reserva en pocos pasos.",
  },
  {
    title: "Seguro y confiable",
    description: "Gestiona tus reservas con una experiencia clara, ordenada y orientada al control.",
  },
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="#inicio" className={styles.brand} aria-label="Ir al inicio de ReservaPlay">
          <span className={styles.brandMark} aria-hidden="true">
            <span className={styles.brandSymbol} />
          </span>
          <span className={styles.brandLabel}>ReservaPlay</span>
        </Link>

        <nav className={styles.nav} aria-label="Menú principal">
          <Link href="#inicio">Inicio</Link>
          <Link href="#canchas">Canchas</Link>
          <Link href="#como-funciona">Cómo funciona</Link>
          <Link href="#contacto">Contacto</Link>
        </nav>
      </header>

      <section className={styles.hero} id="inicio">
        <div className={styles.heroBackdrop} aria-hidden="true">
          <span className={styles.backdropGlowOne} />
          <span className={styles.backdropGlowTwo} />
          <span className={styles.fieldLines} />
          <span className={styles.fieldShadow} />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Tu partido empieza aquí</span>
            <h1 className={styles.heroTitle}>RESERVAPLAY</h1>
            <p className={styles.heroText}>
              Gestiona y reserva canchas sintéticas en segundos.
              <span>Consulta horarios disponibles, organiza tus partidos y mantén el control total desde la plataforma.</span>
            </p>

            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href="/canchas">
                Ver canchas
              </Link>
              <Link className={styles.secondaryButton} href="/registro">
                Registrarse cliente
              </Link>
            </div>

            <div className={styles.heroFeatures} id="como-funciona">
              <article>
                <span className={styles.featureIcon} aria-hidden="true" />
                <strong>Reserva rápida</strong>
              </article>
              <article>
                <span className={styles.featureIcon} aria-hidden="true" />
                <strong>Horarios flexibles</strong>
              </article>
              <article>
                <span className={styles.featureIcon} aria-hidden="true" />
                <strong>Pago seguro y confiable</strong>
              </article>
              <article>
                <span className={styles.featureIcon} aria-hidden="true" />
                <strong>Administración eficiente</strong>
              </article>
            </div>
          </div>

          <aside className={styles.panel} aria-label="Accesos rápidos">
            <article className={styles.accessCard}>
              <div className={styles.accessCardHeader}>
                <span className={styles.cardBadge}>Administradores</span>
                <p>Acceso al panel administrativo</p>
              </div>

              <div className={styles.linkList}>
                <Link href="/admin/registro">1. Registrarse administrador</Link>
                <Link href="/admin/login">2. Inicio de sesión administrador</Link>
              </div>
            </article>

            <article className={styles.accessCard}>
              <div className={styles.accessCardHeader}>
                <span className={styles.cardBadge}>Clientes</span>
                <p>Accede y reserva tu cancha</p>
              </div>

              <div className={styles.linkList}>
                <Link href="/registro">3. Registrarse cliente</Link>
                <Link href="/login">4. Inicio de sesión cliente</Link>
              </div>
            </article>
          </aside>
        </div>
      </section>

      <section className={styles.section} id="canchas">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Beneficios</span>
          <h2>Una experiencia diseñada para operar reservas sin fricción.</h2>
        </div>

        <div className={styles.benefitsGrid}>
          {beneficios.map((beneficio) => (
            <article key={beneficio.title} className={styles.benefitCard}>
              <div className={styles.benefitIcon} aria-hidden="true" />
              <h3>{beneficio.title}</h3>
              <p>{beneficio.description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className={styles.footer} id="contacto">
        <div className={styles.footerBrand}>
          <div className={styles.footerBrandRow}>
            <span className={styles.brandMark} aria-hidden="true">
              <span className={styles.brandSymbol} />
            </span>
            <p className={styles.footerTitle}>ReservaPlay</p>
          </div>
          <p className={styles.footerText}>
            La mejor plataforma para reservar canchas sintéticas de forma rápida, segura y sencilla.
          </p>
        </div>

        <div className={styles.footerColumns}>
          <div>
            <h3>Enlaces rápidos</h3>
            <Link href="#inicio">Inicio</Link>
            <Link href="#canchas">Canchas</Link>
            <Link href="#como-funciona">Cómo funciona</Link>
            <Link href="#contacto">Contacto</Link>
          </div>

          <div>
            <h3>Soporte</h3>
            <Link href="/login">Acceso clientes</Link>
            <Link href="/admin/login">Acceso administradores</Link>
            <Link href="mailto:soporte@reservaplay.com">Correo de soporte</Link>
          </div>

          <div>
            <h3>Términos y condiciones</h3>
            <Link href="#terminos">Ver condiciones</Link>
            <Link href="mailto:contacto@reservaplay.com">Contacto</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}