import Link from "next/link";
<<<<<<< HEAD
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
=======

export default function Aside() {
  return (
    <aside
      style={{
        width: "180px",
        minHeight: "100%",
        backgroundColor: "#ffffff",
        padding: "28px 20px",
        borderLeft: "1px solid #e5e7eb",
        marginRight: "16px",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: "20px",
          color: "#0f172a",
          fontSize: "18px",
          fontWeight: 700,
        }}
      >
        Administración
      </h3>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/admin/canchas">Gestionar Canchas</Link>
        <Link href="/admin/reservas">Gestionar Reservas</Link>
        <Link href="/admin/horarios">Horarios</Link>
        <Link href="/admin/users">Usuarios</Link>
      </nav>
    </aside>
  );
}
>>>>>>> bf164fcfc111077981523662cb8b034c5f6598a0
