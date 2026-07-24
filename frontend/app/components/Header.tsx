import AdminSessionBar from "./admin-session-bar";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className="page-header__content">
        <div>
          <p className={styles.subtitle}>Panel principal</p>
          <h1 className={styles.title}>Bienvenido a ReservaPlay</h1>
        </div>

        <AdminSessionBar />
      </div>
    </header>
  );
}