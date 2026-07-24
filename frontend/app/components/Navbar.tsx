import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.link}>
        Inicio
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
  );
}