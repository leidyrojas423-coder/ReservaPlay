'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './reservas.module.css';

import {
  cancelarReservaAdmin,
  confirmarReservaAdmin,
  listarReservasAdmin,
  registrarPagoManualAdmin,
  type AdminReserva,
} from '../../../services/admin.service';


type AdminReservaVista = Omit<
  AdminReserva,
  'cliente' | 'cancha' | 'horario'
> & {
  cliente?:
    | {
        nombre?: string;
        correo?: string;
        email?: string;
      }
    | string;
  cancha?:
    | {
        nombre?: string;
        ubicacion?: string;
      }
    | string;
  horario?:
    | {
        nombre?: string;
        fechaInicio?: string;
        fechaFin?: string;
      }
    | string;
};


type EstadoReserva =
  | 'Pendiente'
  | 'Confirmada'
  | 'Pagada'
  | 'Finalizada'
  | 'Cancelada';



function normalizarEstado(estado?: string): EstadoReserva {

  const value = (estado ?? '').toLowerCase();


  if (value.includes('cancel')) {
    return 'Cancelada';
  }


  if (value.includes('final')) {
    return 'Finalizada';
  }


  if (value.includes('pag')) {
    return 'Pagada';
  }


  if (value.includes('confirm')) {
    return 'Confirmada';
  }


  return 'Pendiente';

}




function formatDate(value?: string) {

  if (!value) {
    return 'Sin fecha';
  }


  const date = new Date(value);


  if (Number.isNaN(date.getTime())) {
    return value;
  }


  return date.toLocaleDateString('es-CO', {
    day:'2-digit',
    month:'2-digit',
    year:'numeric',
  });

}




function getClienteNombre(reserva: AdminReservaVista) {

  if (!reserva.cliente) {
    return 'Sin cliente';
  }


  if (typeof reserva.cliente === 'string') {
    return reserva.cliente;
  }


  return reserva.cliente.nombre || 'Sin cliente';

}




function getClienteCorreo(reserva: AdminReservaVista) {

  if (!reserva.cliente) {
    return 'Sin correo';
  }


  if (typeof reserva.cliente === 'string') {
    return 'Sin correo';
  }


  return reserva.cliente.correo ||
    reserva.cliente.email ||
    'Sin correo';

}





function getCancha(reserva: AdminReservaVista) {

  if (!reserva.cancha) {
    return 'Sin cancha';
  }


  if (typeof reserva.cancha === 'string') {
    return reserva.cancha;
  }


  return reserva.cancha.nombre ??
    'Sin cancha';

}





function getHorario(reserva: AdminReservaVista) {

  if (!reserva.horario) {
    return 'Sin horario';
  }


  if (typeof reserva.horario === 'string') {
    return reserva.horario;
  }


  const inicio = reserva.horario.fechaInicio;
  const fin = reserva.horario.fechaFin;


  if (inicio && fin) {
    const inicioDate = new Date(inicio);
    const finDate = new Date(fin);

    if (!Number.isNaN(inicioDate.getTime()) && !Number.isNaN(finDate.getTime())) {
      return `${inicioDate.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })} - ${finDate.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}`;
    }
  }


  return reserva.horario.nombre ?? 'Sin horario';

}





function getValor(reserva: AdminReserva) {

  const valor =
    reserva.total ??
    reserva.precio ??
    reserva.monto;


  if (typeof valor !== 'number') {
    return 'Pendiente';
  }


  return valor.toLocaleString('es-CO',{
    style:'currency',
    currency:'COP',
    maximumFractionDigits:0,
  });

}





export default function AdminReservasPage() {


  const [
    reservas,
    setReservas
  ] = useState<AdminReservaVista[]>([]);


  const [
    motivos,
    setMotivos
  ] = useState<Record<string,string>>({});


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    message,
    setMessage
  ] = useState('');


  const [
    error,
    setError
  ] = useState('');





  const cargar = async () => {

    try {

      setLoading(true);
      setError('');
      setMessage('');

      const data =
        await listarReservasAdmin();


      setReservas(data as AdminReservaVista[]);


    } catch {
      setError('Error de conexión con el servidor');

      setReservas([]);


    } finally {

      setLoading(false);

    }

  };





  useEffect(() => {

    void cargar();

  }, []);







  const resumen =
    useMemo(

      () =>

      reservas.reduce(

        (acc,reserva)=>{

          acc[
            normalizarEstado(reserva.estado)
          ] += 1;


          return acc;

        },

        {
          Pendiente:0,
          Confirmada:0,
          Pagada:0,
          Finalizada:0,
          Cancelada:0,
        } as Record<EstadoReserva,number>

      ),

      [reservas]

    );






  const actualizarEstado = (
    id:string,
    estado:EstadoReserva
  ) => {


    setReservas(

      actuales =>

      actuales.map(

        reserva =>

        String(reserva.id) === id

        ?

        {
          ...reserva,
          estado
        }

        :

        reserva

      )

    );

  };







  const confirmar = async(id:string)=>{

    try {

      await confirmarReservaAdmin(id);

      actualizarEstado(
        id,
        'Confirmada'
      );

      setMessage(
        'Reserva confirmada correctamente.'
      );


    } catch(error){

      setError(
        error instanceof Error
        ? error.message
        : 'No se pudo confirmar.'
      );

    }

  };







  const pagar = async(id:string)=>{

    try {

      await registrarPagoManualAdmin(id);

      actualizarEstado(
        id,
        'Pagada'
      );


      setMessage(
        'Pago registrado correctamente.'
      );


    } catch(error){

      setError(
        error instanceof Error
        ? error.message
        : 'No se pudo registrar el pago.'
      );

    }

  };







  const cancelar = async(id:string)=>{


    try {


      await cancelarReservaAdmin(
        id,
        motivos[id]
      );


      actualizarEstado(
        id,
        'Cancelada'
      );


      setMessage(
        'Reserva cancelada correctamente.'
      );


    } catch(error){


      setError(
        error instanceof Error
        ? error.message
        : 'No se pudo cancelar.'
      );


    }


  };







  return (

    <section className={styles.container}>


      <div className={styles.hero}>

        <div>

          <p className={styles.eyebrow}>
            Gestión de reservas
          </p>


          <h2>
            Administración de reservas
          </h2>


          <p>
            Controla confirmaciones, pagos manuales y cancelaciones.
          </p>

        </div>



        <div className={styles.summary}>

          {
            Object.entries(resumen)
            .map(([estado,cantidad])=>(

              <div
                key={estado}
                className={styles.metric}
              >

                <span>
                  {estado}
                </span>


                <strong>
                  {cantidad}
                </strong>


              </div>

            ))
          }

        </div>


      </div>





      {
        error &&
        <p className={styles.error}>
          {error}
        </p>
      }



      {
        message &&
        <p className={styles.success}>
          {message}
        </p>
      }




      {
        loading ?

        <p className={styles.empty}>
          Cargando reservas...
        </p>

        :

        error ?

        null

        :

        reservas.length === 0 ?

        <p className={styles.empty}>
          No hay reservas.
        </p>

        :

        <div className={styles.grid}>


        {
          reservas.map(reserva=>{


            const estado =
              normalizarEstado(
                reserva.estado
              );


            return (

              <article
                key={reserva.id}
                className={styles.card}
              >


                <div className={styles.cardHeader}>

                  <div>

                    <p className={styles.code}>
                      Reserva {reserva.id}
                    </p>


                    <h3>
                      {getClienteNombre(reserva)}
                    </h3>

                  </div>


                  <span
                    className={
                      styles[`status${estado}`]
                      ??
                      styles.statusPendiente
                    }
                  >

                    {estado}

                  </span>


                </div>





                <dl className={styles.meta}>


                  <div>

                    <dt>
                      Cliente
                    </dt>

                    <dd>
                      {getClienteNombre(reserva)}
                    </dd>

                  </div>


                  <div>

                    <dt>
                      Cancha
                    </dt>

                    <dd>
                      {getCancha(reserva)}
                    </dd>

                  </div>



                  <div>

                    <dt>
                      Correo
                    </dt>

                    <dd>
                      {getClienteCorreo(reserva)}
                    </dd>

                  </div>



                  <div>

                    <dt>
                      Fecha
                    </dt>

                    <dd>
                      {
                        formatDate(
                          reserva.fechaReserva ?? reserva.fecha
                        )
                      }
                    </dd>

                  </div>




                  <div>

                    <dt>
                      Horario
                    </dt>


                    <dd>
                      {getHorario(reserva)}
                    </dd>

                  </div>




                  <div>

                    <dt>
                      Estado
                    </dt>


                    <dd>
                      {estado}
                    </dd>

                  </div>



                  <div>

                    <dt>
                      Valor
                    </dt>


                    <dd>
                      {getValor(reserva)}
                    </dd>

                  </div>


                </dl>





                <input

                  className={styles.input}

                  placeholder="Motivo de cancelación"

                  value={
                    motivos[String(reserva.id)]
                    ??
                    ''
                  }

                  onChange={
                    e=>

                    setMotivos(
                      actual=>
                      ({
                        ...actual,
                        [String(reserva.id)]:
                        e.target.value
                      })
                    )
                  }

                />





                <div className={styles.actions}>


                  <button

                    className={styles.actionPrimary}

                    disabled={
                      estado !== 'Pendiente'
                    }

                    onClick={()=>
                      void confirmar(
                        String(reserva.id)
                      )
                    }

                  >

                    Confirmar

                  </button>





                  <button

                    className={styles.actionSecondary}

                    disabled={
                      estado === 'Cancelada'
                      ||
                      estado === 'Finalizada'
                    }

                    onClick={()=>
                      void pagar(
                        String(reserva.id)
                      )
                    }

                  >

                    Registrar pago manual

                  </button>





                  <button

                    className={styles.actionDanger}

                    disabled={
                      estado === 'Cancelada'
                      ||
                      estado === 'Finalizada'
                    }

                    onClick={()=>
                      void cancelar(
                        String(reserva.id)
                      )
                    }

                  >

                    Cancelar

                  </button>



                </div>



              </article>

            );

          })

        }


        </div>

      }


    </section>

  );


}