"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { loginUsuario } from "../../services/auth.service";
import { useAuth } from "../providers";

type LoginResponse = {
  access_token?: string;
  token?: string;
};

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [esError, setEsError] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMensaje(null);

    try {
      const data = (await loginUsuario({
        email,
        password,
      })) as LoginResponse;

      const token = data?.access_token ?? data?.token;
      if (!token) {
        throw new Error("El servidor no devolvió un token de acceso.");
      }

      login(token);

      setEsError(false);
      setMensaje("Inicio de sesión exitoso.");
      router.push("/reservar");
    } catch (loginError) {
      setEsError(true);
      setMensaje(loginError instanceof Error ? loginError.message : "Error al iniciar sesión.");
    }
  };

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>ReservaPlay</h1>
        <h2>Iniciar sesión</h2>

        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label className={styles.label} htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Tu contraseña"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit">Iniciar sesión</button>

        <p className={styles.helper}>
          <Link href="/recuperar-password">¿Olvidaste tu contraseña?</Link>
        </p>

        <p>
          ¿No tienes cuenta? <Link href="/registro">Regístrate aquí</Link>
        </p>

        {mensaje && <p className={esError ? styles.error : styles.success}>{mensaje}</p>}
      </form>
    </main>
  );
}