"use client";

import styles from "./canchas.module.css";

const canchas = [
  {
    id: 1,
    nombre: "Cancha Sintética 1",
    estado: "Disponible",
    horario: "6:00 AM - 10:00 PM"
  },
  {
    id: 2,
    nombre: "Cancha Sintética 2",
    estado: "Mantenimiento",
    horario: "No disponible"
  },
  {
    id: 3,
    nombre: "Cancha Sintética 3",
    estado: "Disponible",
    horario: "8:00 AM - 8:00 PM"
  }
];


export default function CanchasPage() {

  return (
    <main className={styles.container}>

      <h1>
        Canchas Sintéticas Disponibles
      </h1>


      <div className={styles.grid}>

        {canchas.map((cancha) => (

          <div 
            key={cancha.id}
            className={styles.card}
          >

            <h2>
              {cancha.nombre}
            </h2>

            <p>
              Estado: {cancha.estado}
            </p>

            <p>
              Horario: {cancha.horario}
            </p>


            {
              cancha.estado === "Disponible" && (
                <button>
                  Reservar
                </button>
              )
            }


          </div>

        ))}

      </div>

    </main>
  );
}