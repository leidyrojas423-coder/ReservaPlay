import styles from "./dashboard.module.css";


const resumen = [
  {
    titulo: "Total Canchas",
    valor: 5
  },
  {
    titulo: "Reservas Pendientes",
    valor: 8
  },
  {
    titulo: "Reservas Confirmadas",
    valor: 15
  },
  {
    titulo: "Canchas en Mantenimiento",
    valor: 1
  }
];


export default function DashboardPage(){

  return (

    <main className={styles.container}>

      <h1>
        Dashboard Administrador
      </h1>


      <section className={styles.cards}>

        {
          resumen.map((item)=>(
            
            <article 
              key={item.titulo}
              className={styles.card}
            >

              <h2>
                {item.titulo}
              </h2>

              <p>
                {item.valor}
              </p>

            </article>

          ))
        }

      </section>


    </main>

  );

}