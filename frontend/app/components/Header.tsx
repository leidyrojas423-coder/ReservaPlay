<<<<<<< HEAD
import AdminSessionBar from "./admin-session-bar";
=======
>>>>>>> bf164fcfc111077981523662cb8b034c5f6598a0
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
<<<<<<< HEAD
      <div className="page-header__content">
        <div>
          <p className={styles.subtitle}>Panel principal</p>
          <h1 className={styles.title}>Bienvenido a ReservaPlay</h1>
        </div>

        <AdminSessionBar />
      </div>
=======
      <h1 className={styles.title}>
        ![⚽](https://fonts.gstatic.com/s/e/notoemoji/17.0/26bd/72.png) ReservaPlay
      </h1>
      <p className={styles.description}>
        Reserva tu cancha fácilmente
      </p>
>>>>>>> bf164fcfc111077981523662cb8b034c5f6598a0
    </header>
  );
}