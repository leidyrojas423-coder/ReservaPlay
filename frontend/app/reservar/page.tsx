"use client";

import { useState } from "react";
import styles from "./reservar.module.css";

export default function ReservarPage() {

  const [canchaId, setCanchaId] = useState("canchas-demo");
  const [fechaReserva, setFechaReserva] = useState("");
  const [horarioId, setHorarioId] = useState("horario-demo");

  const [mensaje, setMensaje] = useState("");


  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setMensaje("");


    // Leer token directamente del navegador
    const token = localStorage.getItem(
      "reservaplay_token"
    );


    console.log(
      "TOKEN EN RESERVAR:",
      token
    );


    if (!token) {

      setMensaje(
        "Usuario no autenticado"
      );

      return;
    }


    if (!fechaReserva) {

      setMensaje(
        "Seleccione una fecha de reserva"
      );

      return;
    }



    try {


      const response = await fetch(
        "http://localhost:3000/reservas",
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`

          },


          body: JSON.stringify({

            canchaId,

            horarioId,

            fechaReserva

          })

        }

      );



      const data = await response.json();



      console.log(
        "RESPUESTA BACKEND:",
        data
      );



      if (!response.ok) {

        throw new Error(
          data.message ||
          "No se pudo crear la reserva"
        );

      }



      setMensaje(
        "Reserva creada correctamente"
      );


    } catch(error) {


      console.error(
        error
      );


      setMensaje(

        error instanceof Error
          ? error.message
          : "Error inesperado"

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
          Reservar Cancha
        </h1>



        <label>
          Seleccione cancha
        </label>


        <select

          value={canchaId}

          onChange={
            (e) =>
              setCanchaId(
                e.target.value
              )
          }

        >

          <option value="canchas-demo">
            Cancha 1 - Fútbol 5
          </option>


        </select>



        <label>
          Fecha de reserva
        </label>


        <input

          type="date"

          value={fechaReserva}

          onChange={
            (e) =>
              setFechaReserva(
                e.target.value
              )
          }

          required

        />



        <label>
          Horario
        </label>


        <select

          value={horarioId}

          onChange={
            (e) =>
              setHorarioId(
                e.target.value
              )
          }

        >

          <option value="horario-demo">
            6:00 AM - 7:00 AM
          </option>


        </select>



        <button type="submit">

          Confirmar reserva

        </button>



        {
          mensaje && (

            <p>
              {mensaje}
            </p>

          )
        }


      </form>


    </main>

  );

}