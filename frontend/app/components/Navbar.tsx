import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sidebar" aria-label="Navegación principal">
      <div className="brand">
        <span className="brand-name">ReservaPlay</span>
      </div>

      <nav>
        <ul className="nav-list">
          <li><Link href="/">Inicio</Link></li>
          <li><Link href="/mis-reservas">Mis Reservas</Link></li>
          <li><Link href="/dashboard">Reservas</Link></li>
          <li><Link href="/admin/estados-reservas">Estados Reservas</Link></li>
          <li><Link href="/admin/canchas">Canchas</Link></li>
          <li><Link href="/admin/horarios">Horarios</Link></li>
          <li><Link href="/admin/users">Usuarios</Link></li>
        </ul>
      </nav>
    </nav>
  );
}