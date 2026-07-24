import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
<<<<<<< HEAD
    <aside className="sidebar" aria-label="Navegación principal">
      <div className="brand">
        <span className="brand-name">ReservaPlay</span>
      </div>

      <nav className={styles.navbar}>
        <ul className={styles.list}>
          <li><Link href="/" className={styles.link}>Inicio</Link></li>
          <li><Link href="/mis-reservas" className={styles.link}>Mis Reservas</Link></li>
          <li><Link href="/dashboard" className={styles.link}>Reservas</Link></li>
          <li><Link href="/admin/estados-reservas" className={styles.link}>Estados Reservas</Link></li>
          <li><Link href="/admin/canchas" className={styles.link}>Canchas</Link></li>
          <li><Link href="/admin/horarios" className={styles.link}>Horarios</Link></li>
          <li><Link href="/admin/users" className={styles.link}>Usuarios</Link></li>
        </ul>
      </nav>
    </aside>
=======
    <nav className={styles.navbar}>
      <Link href="/dashboard" className={styles.link}>
        Dashboard
      </Link>
      <Link href="/admin/canchas" className={styles.link}>
        Canchas
      </Link>
      <Link href="/admin/reservas" className={styles.link}>
        Reservas
      </Link>
      <Link href="/admin/horarios" className={styles.link}>
        Horarios
      </Link>
      <Link href="/admin/users" className={styles.link}>
        Usuarios
      </Link>
    </nav>
>>>>>>> bf164fcfc111077981523662cb8b034c5f6598a0
  );
}