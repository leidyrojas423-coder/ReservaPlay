import Link from 'next/link';
import { Bebas_Neue } from 'next/font/google';

const sportsTitleFont = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
});

export default function HomePage() {
  return (
    <section className="welcome-hero" aria-label="Bienvenida ReservaPlay">
      <div className="welcome-hero__background" aria-hidden="true">
        <span className="glow glow--one" />
        <span className="glow glow--two" />
      </div>

      <div className="welcome-hero__content">
        <p className="welcome-hero__eyebrow">Reserva simple, juego asegurado</p>
        <h2 className={`welcome-hero__title ${sportsTitleFont.className}`}>ReservaPlay</h2>
        <p className="welcome-hero__description">
          Gestiona y reserva canchas en segundos. Consulta horarios disponibles, organiza tus
          partidos y mantén el control total desde un panel administrativo claro y eficiente.
        </p>

        <div className="welcome-flags" aria-label="Banderas decorativas">
          <span className="welcome-flags__label">Comunidad internacional</span>
          <ul className="welcome-flags__list">
            <li aria-label="Argentina">🇦🇷</li>
            <li aria-label="España">🇪🇸</li>
            <li aria-label="México">🇲🇽</li>
            <li aria-label="Brasil">🇧🇷</li>
            <li aria-label="Uruguay">🇺🇾</li>
            <li aria-label="Chile">🇨🇱</li>
          </ul>
        </div>

        <div className="welcome-hero__actions">
          <Link href="/dashboard" className="welcome-button welcome-button--primary">
            Ir a Reservas
          </Link>
          <Link href="/admin" className="welcome-button welcome-button--secondary">
            Panel de Administración
          </Link>
        </div>

        <div className="welcome-hero__highlights" aria-label="Beneficios de ReservaPlay">
          <article className="highlight-card">
            <h3>Disponibilidad al instante</h3>
            <p>Visualiza horarios por cancha y evita cruces al crear nuevas reservas.</p>
          </article>
          <article className="highlight-card">
            <h3>Control administrativo</h3>
            <p>Administra canchas, horarios y usuarios en un flujo centralizado.</p>
          </article>
          <article className="highlight-card">
            <h3>Flujo rapido</h3>
            <p>Menos pasos, menos errores y mas tiempo para jugar.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
