'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function RecuperarPasswordPage() {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMensaje('Si el correo existe recibirás instrucciones para recuperar tu contraseña');
    setCorreo('');
  };

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <p className={styles.kicker}>Recuperación de acceso</p>
        <h1>Recuperar contraseña</h1>
        <p className={styles.description}>
          Ingresa tu correo electrónico y te enviaremos los pasos para restablecer el acceso.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="recover-email">
            Correo electrónico
          </label>
          <input
            id="recover-email"
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
            required
          />

          <button type="submit">Enviar solicitud</button>

          <p className={styles.message} aria-live="polite">
            {mensaje || 'Si el correo existe recibirás instrucciones para recuperar tu contraseña'}
          </p>

          <p className={styles.backLink}>
            <Link href="/login">Volver al inicio de sesión</Link>
          </p>
        </form>
      </section>
    </main>
  );
}