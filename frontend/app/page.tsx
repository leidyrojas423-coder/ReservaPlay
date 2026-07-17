import Link from 'next/link';
import { Bebas_Neue } from 'next/font/google';

const sportsTitleFont = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
});

const countries = [
  { name: 'Colombia', className: 'flag-badge--colombia' },
  { name: 'España', className: 'flag-badge--spain' },
  { name: 'México', className: 'flag-badge--mexico' },
  { name: 'Brasil', className: 'flag-badge--brazil' },
  { name: 'Uruguay', className: 'flag-badge--uruguay' },
  { name: 'Chile', className: 'flag-badge--chile' },
] as const;

export default function HomePage() {
  return (
    <section className="welcome-hero" aria-label="Bienvenida ReservaPlay">
      <div className="welcome-hero__background" aria-hidden="true">
        <span className="glow glow--one" />
        <span className="glow glow--two" />
      </div>

      <div className="welcome-hero__content">
        <div className="welcome-hero__main">
          <p className="welcome-hero__eyebrow">Tu partido empieza aqui</p>
          <h2 className={`welcome-hero__title ${sportsTitleFont.className}`}>ReservaPlay</h2>
          <p className="welcome-hero__description">
            Gestiona y reserva canchas en segundos. Consulta horarios disponibles, organiza tus
            partidos y mantén el control total desde un panel administrativo claro y eficiente.
          </p>

          <div className="welcome-flags" aria-label="Banderas decorativas">
            <span className="welcome-flags__label">Reserva simple, juego asegurado</span>
            <ul className="welcome-flags__list">
              {countries.map((country) => (
                <li key={country.name} aria-label={country.name}>
                  <span className={`flag-badge ${country.className}`} aria-hidden="true" />
                </li>
              ))}
            </ul>
          </div>

          <div className="welcome-hero__actions">
            <Link href="/mis-reservas" className="welcome-button welcome-button--cta">
              Mis Reservas
            </Link>
            <Link href="/dashboard" className="welcome-button welcome-button--primary">
              Ir a Reservas
            </Link>
            <Link href="/admin" className="welcome-button welcome-button--secondary">
              Panel de Administración
            </Link>
          </div>
        </div>

        <aside className="welcome-hero__side" aria-label="Resumen visual de ReservaPlay">
          <div className="welcome-visual" aria-hidden="true">
            <div className="welcome-visual__court">
              <span className="welcome-visual__line welcome-visual__line--vertical" />
              <span className="welcome-visual__line welcome-visual__line--circle" />
              <span className="welcome-visual__line welcome-visual__line--box-top" />
              <span className="welcome-visual__line welcome-visual__line--box-bottom" />
              <span className="welcome-visual__ball" />
            </div>
          </div>

          <div className="welcome-scoreboard">
            <p className="welcome-scoreboard__label">Partido listo</p>
            <div className="welcome-scoreboard__row">
              <div>
                <span className="welcome-scoreboard__number">24/7</span>
                <p>Consulta de horarios disponible en cualquier momento.</p>
              </div>
              <div>
                <span className="welcome-scoreboard__number">+3</span>
                <p>Flujos clave para reservas, canchas y administración.</p>
              </div>
            </div>
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
        </aside>
      </div>
    </section>
  );
}
