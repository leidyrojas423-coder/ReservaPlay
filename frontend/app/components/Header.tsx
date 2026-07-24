import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        ⚽ ReservaPlay
      </h1>
      <p className={styles.description}>
        Reserva tu cancha fácilmente
      </p>
    </header>
  );
}