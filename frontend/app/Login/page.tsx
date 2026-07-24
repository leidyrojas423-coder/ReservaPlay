"use client";

import { useState } from "react";
import styles from "./login.module.css";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      email,
      password
    });

    // Aquí después conectaremos con NestJS API
  };


  return (
    <main className={styles.container}>

      <form 
        className={styles.form}
        onSubmit={handleSubmit}
      >

        <h1>
          ReservaPlay
        </h1>

        <h2>
          Iniciar sesión
        </h2>


        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />


        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />


        <button type="submit">
          Ingresar
        </button>


      </form>

    </main>
  );
}