"use client";

import { useState } from "react";
import styles from "./login.module.css";
import { setStoredAuthToken } from "../../lib/auth";
import { useRouter } from "next/navigation";


export default function LoginPage() {

  const router = useRouter();


  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [mensaje, setMensaje] = useState("");

  const [cargando, setCargando] = useState(false);



  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setMensaje("");

    setCargando(true);


    try {

      const response = await fetch(
        "http://localhost:3000/auth/login",
        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

          },


          body: JSON.stringify({

            email,

            password,

          }),

        }
      );


      const data = await response.json();



      if (!response.ok) {

        throw new Error(
          data.message ||
          "Credenciales inválidas"
        );

      }



      // Guardar JWT en el navegador

      setStoredAuthToken(
        data.access_token
      );



      setMensaje(
        "Inicio de sesión correcto"
      );



      // Ir a reservar

      router.push(
        "/reservar"
      );



    } catch (error) {


      setMensaje(

        error instanceof Error

        ? error.message

        : "Error inesperado"

      );


    } finally {

      setCargando(false);

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
          Iniciar sesión
        </h2>




        <input

          type="email"

          placeholder="Correo electrónico"

          value={email}

          onChange={
            (e)=>setEmail(e.target.value)
          }

          required

        />




        <input

          type="password"

          placeholder="Contraseña"

          value={password}

          onChange={
            (e)=>setPassword(e.target.value)
          }

          required

        />




        <button

          type="submit"

          disabled={cargando}

        >

          {
            cargando
            ? "Ingresando..."
            : "Ingresar"
          }


        </button>




        {
          mensaje &&

          <p>

            {mensaje}

          </p>

        }



      </form>


    </main>

  );

}