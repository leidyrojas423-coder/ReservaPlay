"use client";

import styles from "./mis-reservas.module.css";


const reservas = [
  {
    id: 1,
    cancha: "Cancha Sintética 1",
    fecha: "25/07/2026",
    horario: "6:00 PM - 7:00 PM",
    estado: "Pendiente"
  },
  {
    id: 2,
    cancha: "Cancha Sintética 2",
    fecha: "28/07/2026",
    horario: "8:00 PM - 9:00 PM",
    estado: "Confirmada"
  }
];


export default function MisReservasPage(){

    return (

        <main className={styles.container}>

            <h1>
                Mis Reservas
            </h1>


            <section className={styles.lista}>

                {
                    reservas.map((reserva)=>(

                        <article 
                            key={reserva.id}
                            className={styles.card}
                        >

                            <h2>
                                {reserva.cancha}
                            </h2>


                            <p>
                                Fecha: {reserva.fecha}
                            </p>


                            <p>
                                Horario: {reserva.horario}
                            </p>


                            <p>
                                Estado:
                                <strong>
                                    {" "}{reserva.estado}
                                </strong>
                            </p>


                        </article>

                    ))
                }

            </section>


        </main>

    );
}