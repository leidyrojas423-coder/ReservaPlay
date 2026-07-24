'use client';

import { useEffect, useState } from 'react';
import { getStoredAuthToken } from '../../../lib/auth';
import styles from './horarios.module.css';


interface Cancha {

  id: string;

  nombre: string;

}



interface Horario {

  id: string;

  nombre: string;

  descripcion?: string;

  fechaInicio: string;

  fechaFin: string;

  activo: boolean;

  canchaId: string;

  cancha?: Cancha;

}



interface FormHorario {

  nombre: string;

  descripcion: string;

  canchaId: string;

  fechaInicio: string;

  fechaFin: string;

  activo: boolean;

}



export default function AdminHorariosPage(){


  const token = getStoredAuthToken();



  const [horarios,setHorarios] =
    useState<Horario[]>([]);



  const [canchas,setCanchas] =
    useState<Cancha[]>([]);



  const [loading,setLoading] =
    useState(true);



  const [error,setError] =
    useState('');



  const [success,setSuccess] =
    useState('');




  const [form,setForm] =
    useState<FormHorario>({

      nombre:'',
      descripcion:'',
      canchaId:'',
      fechaInicio:'',
      fechaFin:'',
      activo:true

    });





  // Cargar canchas

  const cargarCanchas = async()=>{


    if(!token){

      setError(
        'Debe iniciar sesión como administrador'
      );

      return;

    }



    try{


      const response =
        await fetch(
          'http://localhost:3000/canchas',
          {

            headers:{

              Authorization:
                `Bearer ${token}`

            }

          }

        );



      const data =
        await response.json();



      setCanchas(data);



    }catch{


      setError(
        'No se pudieron cargar las canchas'
      );

    }


  };





  // Cargar horarios

  const cargarHorarios = async()=>{


    if(!token){

      setError(
        'Debe iniciar sesión como administrador'
      );

      setLoading(false);

      return;

    }




    try{


      setLoading(true);



      const response =
        await fetch(
          'http://localhost:3000/horarios',
          {

            headers:{

              Authorization:
                `Bearer ${token}`

            }

          }

        );




      const data =
        await response.json();



      setHorarios(data);



    }catch{


      setError(
        'Error cargando horarios'
      );



    }finally{


      setLoading(false);


    }


  };





  useEffect(()=>{


    cargarCanchas();

    cargarHorarios();


  },[]);






  const handleChange = (
    e:React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >
  )=>{


    const {name,value} =
      e.target;



    setForm({

      ...form,

      [name]:value

    });


  };








  const crearHorario =
    async(
      e:React.FormEvent
    )=>{


      e.preventDefault();



      setError('');

      setSuccess('');



      if(!token){

        setError(
          'Debe iniciar sesión'
        );

        return;

      }





      if(
        form.fechaInicio >= form.fechaFin
      ){

        setError(
          'La fecha inicial debe ser menor a la final'
        );

        return;

      }





      try{


        const response =
          await fetch(
            'http://localhost:3000/horarios',
            {

              method:'POST',

              headers:{

                'Content-Type':
                'application/json',

                Authorization:
                `Bearer ${token}`

              },


              body:JSON.stringify(form)


            }

          );





        if(!response.ok){

          throw new Error(
            'No se pudo crear el horario'
          );

        }




        setSuccess(
          'Horario creado correctamente'
        );




        setForm({

          nombre:'',
          descripcion:'',
          canchaId:'',
          fechaInicio:'',
          fechaFin:'',
          activo:true

        });




        cargarHorarios();



      }catch(error){


        setError(
          error instanceof Error
          ? error.message
          : 'Error inesperado'
        );


      }



    };







return(


<main className={styles.container}>


<h1 className={styles.title}>
Gestión de Horarios
</h1>



<p className={styles.description}>
Administra horarios asociados a cada cancha.
</p>





{
error &&

<p className={styles.error}>
{error}
</p>

}




{
success &&

<p className={styles.success}>
{success}
</p>

}







<form
className={styles.form}
onSubmit={crearHorario}
>



<input

name="nombre"

placeholder="Nombre horario"

value={form.nombre}

onChange={handleChange}

required

/>




<input

name="descripcion"

placeholder="Descripción"

value={form.descripcion}

onChange={handleChange}

/>






<select

name="canchaId"

value={form.canchaId}

onChange={handleChange}

required

>


<option value="">
Seleccione cancha
</option>


{

canchas.map(cancha=>(


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
Inicio
</label>


<input

name="fechaInicio"

type="datetime-local"

value={form.fechaInicio}

onChange={handleChange}

required

/>







<label>
Fin
</label>


<input

name="fechaFin"

type="datetime-local"

value={form.fechaFin}

onChange={handleChange}

required

/>







<label className={styles.checkbox}>


<input

type="checkbox"

checked={form.activo}

onChange={
(e)=>
setForm({

...form,

activo:e.target.checked

})

}


/>

Activo

</label>






<button
className={styles.button}
>

Crear horario

</button>



</form>









{
loading ?

<p>
Cargando horarios...
</p>


:

<table className={styles.table}>


<thead>

<tr>

<th>
Nombre
</th>


<th>
Cancha
</th>


<th>
Inicio
</th>


<th>
Fin
</th>


<th>
Estado
</th>


</tr>

</thead>





<tbody>


{

horarios.map(horario=>(


<tr key={horario.id}>


<td>
{horario.nombre}
</td>



<td>
{
horario.cancha?.nombre
||
horario.canchaId
}
</td>



<td>
{horario.fechaInicio}
</td>



<td>
{horario.fechaFin}
</td>



<td>

{
horario.activo
?
'Activo'
:
'Inactivo'
}

</td>



</tr>


))


}



</tbody>



</table>


}





</main>


);


}