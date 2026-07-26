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




function formatTime(value?: string) {

  if (!value) {
    return '';
  }


  const date = new Date(value);


  if (!Number.isNaN(date.getTime())) {

    return date.toLocaleTimeString('es-CO',{
      hour:'2-digit',
      minute:'2-digit',
      hour12:false,
    });

  }


  return value.slice(0,5);

}





function getCliente(reserva: AdminReserva) {

  if (!reserva.cliente) {
    return 'Cliente no disponible';
  }


  if (typeof reserva.cliente === 'string') {
    return reserva.cliente;
  }


  const nombre = [
    reserva.cliente.nombre,
    reserva.cliente.apellido,
  ]
  .filter(Boolean)
  .join(' ')
  .trim();


  return nombre ||
    reserva.cliente.email ||
    'Cliente no disponible';

}





function getCancha(reserva: AdminReserva) {

  if (!reserva.cancha) {
    return 'Cancha no disponible';
  }


  if (typeof reserva.cancha === 'string') {
    return reserva.cancha;
  }


  return reserva.cancha.nombre ??
    'Cancha no disponible';

}





function getHorario(reserva: AdminReserva) {

  if (!reserva.horario) {
    return 'Horario no disponible';
  }


  if (typeof reserva.horario === 'string') {
    return reserva.horario;
  }


  const inicio =
    formatTime(
      reserva.horario.fechaInicio ??
      reserva.horario.horaInicio
    );


  const fin =
    formatTime(
      reserva.horario.fechaFin ??
      reserva.horario.horaFin
    );



  if (inicio && fin) {

    return `${inicio} - ${fin}`;

  }



  return reserva.horario.nombre ??
    'Horario no disponible';

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
  ] = useState<AdminReserva[]>([]);


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

      const data =
        await listarReservasAdmin();


      setReservas(data);


    } catch(errorCarga) {


      setError(
        errorCarga instanceof Error
          ? errorCarga.message
          : 'No se pudieron cargar las reservas.'
      );


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
                      {getCliente(reserva)}
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
                      Cancha
                    </dt>

                    <dd>
                      {getCancha(reserva)}
                    </dd>

                  </div>



                  <div>

                    <dt>
                      Fecha
                    </dt>

                    <dd>
                      {
                        formatDate(
                          reserva.fechaReserva
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