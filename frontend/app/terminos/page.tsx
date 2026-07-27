import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Terminos y condiciones | ReservaPlay",
  description: "Terminos y condiciones de uso de la plataforma ReservaPlay.",
};

const secciones = [
  {
    title: "Uso de la plataforma",
    body: "ReservaPlay permite consultar canchas y gestionar reservas de manera digital. El uso de la plataforma implica aceptar estas condiciones y utilizar el servicio con fines legitimos, respetando la normativa aplicable.",
  },
  {
    title: "Reservas",
    body: "Las reservas estan sujetas a disponibilidad en tiempo real. La confirmacion de una reserva depende de la validacion de la informacion suministrada y del cumplimiento de las condiciones publicadas para cada cancha y franja horaria.",
  },
  {
    title: "Cancelaciones",
    body: "Las cancelaciones deben realizarse desde los canales habilitados en la plataforma y dentro de los plazos definidos por la administracion. Fuera de dichos plazos pueden aplicarse restricciones o cargos segun las politicas vigentes.",
  },
  {
    title: "Responsabilidades del usuario",
    body: "Cada usuario es responsable de la veracidad de los datos registrados, del cuidado de sus credenciales de acceso y del uso adecuado de las instalaciones reservadas. Cualquier uso indebido puede derivar en la suspension de la cuenta.",
  },
  {
    title: "Tratamiento de informacion",
    body: "La informacion personal se trata para operar el servicio, gestionar reservas y brindar soporte. ReservaPlay aplica medidas razonables de seguridad y confidencialidad conforme a la normativa de proteccion de datos aplicable.",
  },
];

export default function TerminosPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Marco legal</p>
        <h1 className={styles.title}>Terminos y condiciones de uso</h1>
        <p className={styles.subtitle}>
          Consulta las condiciones que regulan el uso de ReservaPlay para la gestion de canchas,
          reservas y atencion de usuarios.
        </p>
      </section>

      <section className={styles.card} aria-labelledby="terminos-listado">
        <div className={styles.cardHeader}>
          <h2 id="terminos-listado">Términos y condiciones</h2>
          <span className={styles.badge}>ReservaPlay</span>
        </div>

        <div className={styles.grid}>
          {secciones.map((seccion) => (
            <article key={seccion.title} className={styles.item}>
              <h3>{seccion.title}</h3>
              <p>{seccion.body}</p>
            </article>
          ))}
        </div>

        <div className={styles.actions}>
          <Link href="/" className={styles.secondaryButton}>
            Volver al inicio
          </Link>
          <Link href="/canchas" className={styles.primaryButton}>
            Explorar canchas
          </Link>
        </div>
      </section>
    </main>
  );
}
