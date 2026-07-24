"use client";

import { useState } from "react";
import styles from "./reservar.module.css";


export default function ReservarPage(){

    const [fecha,setFecha] = useState("");
    const [hora,setHora] = useState("");
    

    const handleSubmit = (e:React.FormEvent)=>{
        e.preventDefault();

        console.log({
            fecha,
            hora
        });

        // Después conectaremos con NestJS
    }


    return(

        <main className={styles.container}>

            <form 
                className={styles.form}
                onSubmit={handleSubmit}
            >

                <h1>
                    Reservar Cancha
                </h1>


                <label>
                    Fecha de reserva
                </label>

                <input
                    type="date"
                    value={fecha}
                    onChange={(e)=>setFecha(e.target.value)}
                    required
                />


                <label>
                    Horario
                </label>


                <select
                    value={hora}
                    onChange={(e)=>setHora(e.target.value)}
                    required
                >

                    <option value="">
                        Seleccione horario
                    </option>

                    <option>
                        6:00 AM - 7:00 AM
                    </option>

                    <option>
                        7:00 AM - 8:00 AM
                    </option>

                    <option>
                        8:00 PM - 9:00 PM
                    </option>

                </select>


                <button type="submit">
                    Confirmar reserva
                </button>


            </form>


        </main>

    )
}