import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>ReservaPlay</h1>
      <p>Reserva tu cancha sintética de forma rápida y sencilla.</p>

      <nav aria-label="Accesos principales">
        <Link href="/login">Iniciar sesión</Link>
        <Link href="/registro">Registrarse</Link>
        <Link href="/canchas">Ver canchas</Link>
      </nav>
    </main>
  );
}