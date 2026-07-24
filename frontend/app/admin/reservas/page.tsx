'use client';

import { useMemo, useState } from 'react';
import { Bebas_Neue } from 'next/font/google';
import styles from './reservas.module.css';


type EstadoReserva =
  | 'Pendiente'
  | 'Confirmada'
  | 'Pagada'
  | 'Finalizada'
  | 'Cancelada';



interface ReservaAdmin {

  id: string;

  cliente: string;

  cancha: string;

  fecha: string;

  hora: string;

  monto: string;

  estado: EstadoReserva;

}



const sportsTitleFont = Bebas_Neue({

  weight: '400',

  subsets: ['latin'],

});




const estados: EstadoReserva[] = [

  'Pendiente',
  'Confirmada',
  'Pagada',
  'Finalizada',
  'Cancelada',

];





const transicionesPermitidas:
Record<EstadoReserva, EstadoReserva[]> = {


  Pendiente: [

    'Confirmada',

    'Cancelada'

  ],



  Confirmada: [

    'Pagada',

    'Cancelada'

  ],



  Pagada: [

    'Finalizada'

  ],



  Finalizada: [],



  Cancelada: [],


};







const reservasIniciales: ReservaAdmin[] = [


  {

    id:'R-001',

    cliente:'Andrés Toro',

    cancha:'Cancha Sintética 1',

    fecha:'2026-07-25',

    hora:'18:00 - 19:00',

    monto:'$120.000',

    estado:'Pendiente'

  },



  {

    id:'R-002',

    cliente:'Laura Méndez',

    cancha:'Cancha Sintética 2',

    fecha:'2026-07-26',

    hora:'20:00 - 21:00',

    monto:'$150.000',

    estado:'Confirmada'

  },



  {

    id:'R-003',

    cliente:'Carlos Díaz',

    cancha:'Cancha Sintética 3',

    fecha:'2026-07-20',

    hora:'17:00 - 18:00',

    monto:'$100.000',

    estado:'Pagada'

  }



];








function getEstadoClase(
  estado:EstadoReserva
){

  switch(estado){


    case 'Pendiente':

      return styles.pendiente;


    case 'Confirmada':

      return styles.confirmada;


    case 'Pagada':

      return styles.pagada;


    case 'Finalizada':

      return styles.finalizada;


    case 'Cancelada':

      return styles.cancelada;


    default:

      return '';

  }

}








export default function AdminReservasPage(){



const [reservas,setReservas] =
useState<ReservaAdmin[]>(reservasIniciales);



const [proximosEstados,setProximosEstados] =
useState<Record<string,EstadoReserva>>(

  Object.fromEntries(

    reservasIniciales.map(

      reserva =>

      [
        reserva.id,
        reserva.estado
      ]

    )

  )

);



const [mensaje,setMensaje] =
useState('');






const resumen = useMemo(()=>{


return reservas.reduce(

(acc,reserva)=>{


acc[reserva.estado] +=1;


return acc;


},


{

Pendiente:0,

Confirmada:0,

Pagada:0,

Finalizada:0,

Cancelada:0


} as Record<EstadoReserva,number>


);


},[reservas]);










const cambiarEstado = (
id:string
)=>{


const reserva =
reservas.find(
item=>item.id===id
);



const nuevoEstado =
proximosEstados[id];




if(!reserva || !nuevoEstado){

return;

}





const permitido =
transicionesPermitidas[
reserva.estado
].includes(
nuevoEstado
);




if(!permitido){


setMensaje(

`No permitido: ${reserva.estado} → ${nuevoEstado}`

);


return;

}





setReservas(

actual=>

actual.map(

item=>

item.id===id

?

{

...item,

estado:nuevoEstado

}

:

item

)

);



setMensaje(

`Reserva ${id} actualizada correctamente`

);



};










return (


<section className={styles.container}>


<header>


<p className={styles.subtitle}>
Panel administrativo
</p>



<h1 className={`${styles.title} ${sportsTitleFont.className}`}>

Gestión de Reservas

</h1>



<p>

Administra el ciclo de vida de las reservas.

</p>


</header>






<div className={styles.summary}>


{
Object.entries(resumen).map(

([estado,cantidad])=>(


<div
key={estado}
className={styles.card}
>


<span>
{estado}
</span>


<strong>
{cantidad}
</strong>


</div>


)

)

}


</div>







{
mensaje &&

<p className={styles.message}>

{mensaje}

</p>

}








<div className={styles.grid}>


{

reservas.map(reserva=>(



<article
key={reserva.id}
className={styles.reserva}
>



<div className={styles.headerCard}>


<h2>

{reserva.cliente}

</h2>


<span
className={
getEstadoClase(
reserva.estado
)
}
>

{reserva.estado}

</span>


</div>







<p>
Cancha:
{reserva.cancha}
</p>


<p>
Fecha:
{reserva.fecha}
</p>


<p>
Horario:
{reserva.hora}
</p>


<p>
Valor:
{reserva.monto}
</p>






<select

value={
proximosEstados[reserva.id]
}

onChange={

e=>

setProximosEstados(

{

...proximosEstados,

[reserva.id]:
e.target.value as EstadoReserva

}

)

}


>


{

estados.map(estado=>(


<option
key={estado}
value={estado}
>

{estado}

</option>


))

}


</select>





<button

onClick={()=>
cambiarEstado(reserva.id)
}

>

Actualizar estado

</button>






</article>



))

}



</div>





</section>


);


}