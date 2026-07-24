"use client";

import { useState } from "react";
import styles from "./registro.module.css";

export default function RegistroPage() {

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    password: "",
    confirmarPassword: ""
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if(formData.password !== formData.confirmarPassword){
      alert("Las contraseñas no coinciden");
      return;
    }


    console.log(formData);

    // Aquí después conectaremos con NestJS
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
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />


        <input
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
        />


        <input
          name="correo"
          type="email"
          placeholder="Correo electrónico"
          value={formData.correo}
          onChange={handleChange}
          required
        />


        <input
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          required
        />


        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />


        <input
          name="confirmarPassword"
          type="password"
          placeholder="Confirmar contraseña"
          value={formData.confirmarPassword}
          onChange={handleChange}
          required
        />


        <button type="submit">
          Registrarme
        </button>


      </form>

    </main>

  );
}