'use client';

import { useEffect, useState } from 'react';
import { getStoredAuthToken } from '../../../lib/auth';
import styles from './canchas.module.css';


interface Cancha {
  id: string;
  nombre: string;
  descripcion?: string;
  ubicacion: string;
  estado: 'Disponible' | 'Ocupada' | 'Mantenimiento';
  capacidad?: number;
  precio?: number;
  activo: boolean;
}


interface FormCancha {
  nombre: string;
  descripcion: string;
  ubicacion: string;
  estado: 'Disponible' | 'Ocupada' | 'Mantenimiento';
  capacidad: string;
  precio: string;
  activo: boolean;
}



export default function AdminCanchasPage() {


  const [canchas, setCanchas] = useState<Cancha[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');



  const [form, setForm] = useState<FormCancha>({

    nombre: '',
    descripcion: '',
    ubicacion: '',
    estado: 'Disponible',
    capacidad: '',
    precio: '',
    activo: true,

  });



  const token = getStoredAuthToken();



  const cargarCanchas = async () => {


    if (!token) {

      setError(
        'Debe iniciar sesión como administrador'
      );

      setLoading(false);

      return;

    }



    try {


      setLoading(true);



      const response = await fetch(
        'http://localhost:3000/canchas',
        {

          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }

      );



      if (!response.ok) {

        throw new Error(
          'Error cargando canchas'
        );

      }



      const data = await response.json();



      setCanchas(data);



    } catch (error) {


      setError(
        error instanceof Error
          ? error.message
          : 'Error inesperado'
      );



    } finally {


      setLoading(false);


    }


  };





  useEffect(() => {

    cargarCanchas();

  }, []);







  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {


    const {name,value} = e.target;



    setForm({

      ...form,

      [name]: value,

    });



  };








  const handleSubmit = async (
    e: React.FormEvent
  ) => {


    e.preventDefault();


    setError('');

    setSuccess('');



    if (!token) {

      setError(
        'Debe iniciar sesión como administrador'
      );

      return;

    }





    try {



      const response = await fetch(
        'http://localhost:3000/canchas',
        {

          method:'POST',

          headers:{

            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`

          },


          body:JSON.stringify({

            nombre: form.nombre,

            descripcion: form.descripcion,

            ubicacion: form.ubicacion,

            estado: form.estado,

            capacidad: form.capacidad
              ? Number(form.capacidad)
              : undefined,


            precio: form.precio
              ? Number(form.precio)
              : undefined,


            activo: form.activo

          })


        }

      );





      if(!response.ok){

        throw new Error(
          'No se pudo crear la cancha'
        );

      }






      setSuccess(
        'Cancha creada correctamente'
      );




      setForm({

        nombre:'',
        descripcion:'',
        ubicacion:'',
        estado:'Disponible',
        capacidad:'',
        precio:'',
        activo:true

      });




      cargarCanchas();





    }catch(error){



      setError(

        error instanceof Error
          ? error.message
          : 'Error inesperado'

      );


    }



  };






  return (


    <main className={styles.container}>


      <h1 className={styles.title}>
        Gestión de Canchas
      </h1>



      <p className={styles.description}>
        Administra las canchas disponibles para reservas.
      </p>





      {
        error && (

          <p className={styles.error}>
            {error}
          </p>

        )
      }





      {
        success && (

          <p className={styles.success}>
            {success}
          </p>

        )
      }







      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >





        <input

          name="nombre"

          placeholder="Nombre de la cancha"

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





        <input

          name="ubicacion"

          placeholder="Ubicación"

          value={form.ubicacion}

          onChange={handleChange}

          required

        />







        <select

          name="estado"

          value={form.estado}

          onChange={handleChange}

        >


          <option value="Disponible">
            Disponible
          </option>


          <option value="Ocupada">
            Ocupada
          </option>


          <option value="Mantenimiento">
            Mantenimiento
          </option>


        </select>






        <input

          name="capacidad"

          type="number"

          placeholder="Capacidad jugadores"

          value={form.capacidad}

          onChange={handleChange}

        />







        <input

          name="precio"

          type="number"

          placeholder="Precio"

          value={form.precio}

          onChange={handleChange}

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


          Activa


        </label>







        <button
          className={styles.button}
          type="submit"
        >

          Crear Cancha

        </button>





      </form>









      {

        loading ? (


          <p>
            Cargando canchas...
          </p>


        ) : (



          <div className={styles.tableContainer}>


          <table className={styles.table}>


            <thead>

              <tr>

                <th>
                  Nombre
                </th>


                <th>
                  Ubicación
                </th>


                <th>
                  Estado
                </th>


                <th>
                  Capacidad
                </th>


                <th>
                  Precio
                </th>


              </tr>


            </thead>






            <tbody>


              {

                canchas.map((cancha)=>(


                  <tr key={cancha.id}>


                    <td>
                      {cancha.nombre}
                    </td>



                    <td>
                      {cancha.ubicacion}
                    </td>



                    <td>
                      {cancha.estado}
                    </td>



                    <td>
                      {cancha.capacidad ?? '-'}
                    </td>



                    <td>
                      {cancha.precio ?? '-'}
                    </td>



                  </tr>


                ))

              }



            </tbody>


          </table>


          </div>



        )

      }




    </main>


  );

}