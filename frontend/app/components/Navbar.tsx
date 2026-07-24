import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar} aria-label="Navegación principal">
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
  );
}