'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { registrarAdministrador } from '../../../services/auth.service';
import styles from './registro.module.css';

export default function AdminRegistroPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [documento, setDocumento] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [esError, setEsError] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGuardando(true);
    setMensaje('');

    try {
      await registrarAdministrador({
        nombre,
        apellido,
        documento,
        email,
        telefono,
        password,
      });

      setEsError(false);
      setMensaje('Registro enviado. La cuenta debe quedar con rol administrador en backend para acceder al panel.');

      setTimeout(() => {
        router.push('/admin/login');
      }, 1600);
    } catch (error) {
      setEsError(true);
      setMensaje(error instanceof Error ? error.message : 'No se pudo completar el registro administrativo.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.panel}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Alta administrativa</p>
          <h1>Registrar nuevo administrador</h1>
          <p>
            Crea la cuenta operativa del equipo administrativo. El acceso al dashboard depende de que el backend asigne el rol admin a esta cuenta.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.grid}>
            <input placeholder="Nombre" value={nombre} onChange={(event) => setNombre(event.target.value)} required />
            <input placeholder="Apellido" value={apellido} onChange={(event) => setApellido(event.target.value)} required />
            <input placeholder="Documento" value={documento} onChange={(event) => setDocumento(event.target.value)} required />
            <input type="email" placeholder="Correo" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <input placeholder="Teléfono" value={telefono} onChange={(event) => setTelefono(event.target.value)} required />
            <input type="password" placeholder="Contraseña" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>

          <button type="submit" disabled={guardando}>
            {guardando ? 'Registrando...' : 'Registrar administrador'}
          </button>

          {mensaje ? <p className={esError ? styles.error : styles.success}>{mensaje}</p> : null}

          <p className={styles.helper}>
            ¿Ya tienes credenciales? <Link href="/admin/login">Ir al acceso administrativo</Link>
          </p>
        </form>
      </section>
    </main>
  );
}