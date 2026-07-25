"use client";

import { useState } from "react";
import styles from "./reservar.module.css";
import { getStoredAuthToken } from "../../lib/auth";


export default function ReservarPage() {


  const [fechaReserva, setFechaReserva] = useState("");

  const [canchaId, setCanchaId] = useState("");

  const [horarioId, setHorarioId] = useState("");

  const [mensaje, setMensaje] = useState("");



  const canchas = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      nombre: "Cancha 1 - Fútbol 5",
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      nombre: "Cancha 2 - Fútbol 7",
    },
  ];



  const horarios = [
    {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      nombre: "6:00 AM - 7:00 AM",
    },
    {
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      nombre: "7:00 AM - 8:00 AM",
    },
  ];





  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();


    const token = getStoredAuthToken();



    if (!token) {

      setMensaje(
        "Debe iniciar sesión para reservar"
      );

      return;

    }




    try {


      const response = await fetch(
        "http://localhost:3000/reservas",
        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,

          },


          body: JSON.stringify({

            canchaId,

            horarioId,

            fechaReserva,

          }),

        }

      );




      const data = await response.json();



      if(!response.ok){

        throw new Error(
          data.message || "Error creando reserva"
        );

      }



      setMensaje(
        "Reserva creada correctamente"
      );


      setFechaReserva("");
      setCanchaId("");
      setHorarioId("");



    } catch(error){

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

          onChange={(e)=>
            setCanchaId(e.target.value)
          }

          required

        >

          <option value="">
            Seleccione cancha
          </option>


          {
            canchas.map((cancha)=>(

              <option
                key={cancha.id}
                value={cancha.id}
              >

                {cancha.nombre}

              </option>

            ))
          }


        </select>





        <label>
          Fecha de reserva
        </label>


        <input

          type="date"

          value={fechaReserva}

          onChange={(e)=>
            setFechaReserva(e.target.value)
          }

          required

        />






        <label>
          Horario
        </label>



        <select

          value={horarioId}

          onChange={(e)=>
            setHorarioId(e.target.value)
          }

          required

        >

          <option value="">
            Seleccione horario
          </option>



          {
            horarios.map((horario)=>(

              <option

                key={horario.id}

                value={horario.id}

              >

                {horario.nombre}

              </option>

            ))
          }



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