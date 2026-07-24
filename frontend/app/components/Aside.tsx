import Link from "next/link";
import styles from "./Aside.module.css";

export default function Aside() {
  return (
    <aside className={styles.aside} aria-label="Navegación principal">
      <div className={styles.brand}>
        <h2 className={styles.brandName}>ReservaPlay</h2>
      </div>

      <nav className={styles.nav}>
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
  );
}
