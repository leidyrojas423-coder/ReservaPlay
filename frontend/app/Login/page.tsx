"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { authApi } from "../../lib/api";
import { setStoredAuthToken } from "../../lib/auth";

type LoginResponse = {
  access_token?: string;
  token?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await authApi.login<LoginResponse>({ correo, password });
      const token = data.access_token ?? data.token;

      if (!token) {
        throw new Error("La respuesta del servidor no incluyo un token.");
      }

      setStoredAuthToken(token);
      setSuccess("Inicio de sesion exitoso.");
      router.push("/reservar");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Error inesperado al iniciar sesion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>ReservaPlay</h1>
        <h2>Iniciar sesion</h2>

        <label className={styles.label} htmlFor="correo">
          Correo
        </label>
        <input
          id="correo"
          name="correo"
          type="email"
          placeholder="correo@ejemplo.com"
          value={correo}
          onChange={(event) => setCorreo(event.target.value)}
          required
        />

        <label className={styles.label} htmlFor="password">
          Contrasena
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Tu contrasena"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        {success && <p className={styles.success}>{success}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </main>
  );
}