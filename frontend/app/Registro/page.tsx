"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./registro.module.css";
import { registrarUsuario } from "../../services/auth.service";

export default function RegistroPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMensaje("");
    setRegistroExitoso(false);

    try {
      await registrarUsuario({
        nombre,
        apellido,
        documento,
        email,
        password,
        telefono,
      });

      setRegistroExitoso(true);
      setMensaje("Registro exitoso. Ya puedes iniciar sesión.");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      setRegistroExitoso(false);
      const mensajeError =
        error?.response?.data?.message ||
        "No se pudo completar el registro. Intenta nuevamente.";
      setMensaje(
        Array.isArray(mensajeError)
          ? mensajeError.join(". ")
          : String(mensajeError)
      );
    }
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
          Crear cuenta
        </h2>


        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />


        <input
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
        />


        <label htmlFor="documento">
          Documento
        </label>


        <input
          id="documento"
          name="documento"
          type="number"
          inputMode="numeric"
          min="0"
          placeholder="Documento"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          required
        />


        <input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />


        <input
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />


        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />


        <button type="submit">
          Registrarme
        </button>

        {mensaje && <p>{mensaje}</p>}

        {registroExitoso && (
          <p>
            Ir a iniciar sesión: <Link href="/login">/login</Link>
          </p>
        )}


      </form>

    </main>

  );
}