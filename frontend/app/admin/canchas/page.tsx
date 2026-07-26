'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './canchas.module.css';
import {
  actualizarCancha,
  crearCancha,
  desactivarCancha,
  listarCanchas,
  type AdminCancha,
} from '../../../services/admin.service';

type FormCancha = {
  nombre: string;
  descripcion: string;
  ubicacion: string;
  capacidad: string;
  precio: string;
};

const initialForm: FormCancha = {
  nombre: '',
  descripcion: '',
  ubicacion: '',
  capacidad: '',
  precio: '',
};

function formatCurrency(value?: number) {
  if (typeof value !== 'number') {
    return 'Sin definir';
  }

  return value.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });
}

export default function AdminCanchasPage() {

  const [canchas, setCanchas] = useState<AdminCancha[]>([]);
  const [form, setForm] = useState<FormCancha>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


  const cargarCanchas = async () => {

    try {

      setLoading(true);
      setError('');

      const data = await listarCanchas();

      setCanchas(data);

    } catch (loadError) {

      setError(
        loadError instanceof Error
          ? loadError.message
          : 'No se pudieron cargar las canchas.'
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    void cargarCanchas();

  }, []);



  const resumen = useMemo(() => {

    const disponibles =
      canchas.filter(
        (cancha) =>
          cancha.estado === 'Disponible'
      ).length;


    const mantenimiento =
      canchas.filter(
        (cancha) =>
          cancha.estado === 'Mantenimiento'
      ).length;


    return {

      total: canchas.length,

      disponibles,

      mantenimiento,

    };


  }, [canchas]);





  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

    const { name, value } = event.target;


    setForm((current) => ({
      ...current,
      [name]: value,
    }));

  };





  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    setSaving(true);
    setError('');
    setMessage('');


    try {


      await crearCancha({

        nombre: form.nombre,

        descripcion: form.descripcion,

        ubicacion: form.ubicacion,

        capacidad: form.capacidad
          ? Number(form.capacidad)
          : undefined,

        precio: form.precio
          ? Number(form.precio)
          : undefined,

        activo: true,

      });



      setForm(initialForm);

      setMessage(
        'Cancha creada correctamente.'
      );


      await cargarCanchas();



    } catch (submitError) {


      setError(

        submitError instanceof Error
          ? submitError.message
          : 'No se pudo crear la cancha.'

      );


    } finally {

      setSaving(false);

    }

  };






  const handleToggleEstado = async (
    cancha: AdminCancha
  ) => {


    setError('');
    setMessage('');



    try {


      if (
        cancha.estado === 'Mantenimiento'
      ) {


        await actualizarCancha(

          cancha.id,

          {

            nombre: cancha.nombre,

            descripcion: cancha.descripcion,

            ubicacion: cancha.ubicacion,

            capacidad: cancha.capacidad,

            precio: cancha.precio,

            activo:true,

            estado:'Disponible',

          }

        );


        setMessage(
          `La cancha ${cancha.nombre} quedó disponible.`
        );


      } else {



        await desactivarCancha(
          cancha.id
        );


        setMessage(
          `La cancha ${cancha.nombre} pasó a mantenimiento.`
        );


      }



      await cargarCanchas();



    } catch(toggleError) {


      setError(

        toggleError instanceof Error
          ? toggleError.message
          : 'No se pudo actualizar el estado de la cancha.'

      );


    }


  };







  return (

    <section className={styles.container}>


      <div className={styles.hero}>


        <div>

          <p className={styles.eyebrow}>
            Gestión de canchas
          </p>


          <h2>
            Disponibilidad, mantenimiento y alta operativa
          </h2>


          <p>
            Administra inventario deportivo y controla qué canchas están listas para reservarse.
          </p>


        </div>



        <div className={styles.stats}>


          <div>

            <span>Total</span>

            <strong>
              {resumen.total}
            </strong>

          </div>



          <div>

            <span>Disponibles</span>

            <strong>
              {resumen.disponibles}
            </strong>

          </div>



          <div>

            <span>Mantenimiento</span>

            <strong>
              {resumen.mantenimiento}
            </strong>

          </div>


        </div>


      </div>





      <div className={styles.grid}>



        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >


          <div className={styles.sectionHeader}>

            <h3>
              Nueva cancha
            </h3>


            <p>
              Registra una cancha y déjala lista para operación.
            </p>


          </div>





          <div className={styles.formGrid}>


            <input
              name="nombre"
              placeholder="Nombre comercial"
              value={form.nombre}
              onChange={handleChange}
              required
            />



            <input
              name="ubicacion"
              placeholder="Ubicación"
              value={form.ubicacion}
              onChange={handleChange}
              required
            />



            <input
              name="capacidad"
              type="number"
              min="1"
              placeholder="Capacidad"
              value={form.capacidad}
              onChange={handleChange}
            />



            <input
              name="precio"
              type="number"
              min="0"
              placeholder="Precio por reserva"
              value={form.precio}
              onChange={handleChange}
            />



            <textarea
              name="descripcion"
              placeholder="Descripción operativa"
              value={form.descripcion}
              onChange={handleChange}
              rows={4}
            />



          </div>




          <button
            type="submit"
            className={styles.primaryButton}
            disabled={saving}
          >

            {saving
              ? 'Guardando...'
              : 'Crear cancha'}

          </button>




          {error && (
            <p className={styles.error}>
              {error}
            </p>
          )}



          {message && (
            <p className={styles.success}>
              {message}
            </p>
          )}



        </form>







        <div className={styles.panel}>


          <div className={styles.sectionHeader}>


            <h3>
              Inventario actual
            </h3>


            <p>
              Cambia entre disponible y mantenimiento sin salir del panel.
            </p>


          </div>





          {loading && (

            <p className={styles.empty}>
              Cargando canchas...
            </p>

          )}





          {!loading && canchas.length === 0 && (

            <p className={styles.empty}>
              No hay canchas registradas.
            </p>

          )}






          <div className={styles.list}>


            {canchas.map((cancha)=>(


              <article
                key={cancha.id}
                className={styles.card}
              >



                <div className={styles.cardHeader}>


                  <div>

                    <h4>
                      {cancha.nombre}
                    </h4>


                    <p>
                      {cancha.ubicacion ?? 'Ubicación no disponible'}
                    </p>


                  </div>





                  <span
                    className={
                      cancha.estado === 'Mantenimiento'
                        ? styles.statusOff
                        : styles.statusOn
                    }
                  >

                    {cancha.estado}

                  </span>


                </div>





                <dl className={styles.meta}>


                  <div>

                    <dt>
                      Capacidad
                    </dt>


                    <dd>
                      {cancha.capacidad ?? 'No definida'}
                    </dd>


                  </div>




                  <div>

                    <dt>
                      Tarifa
                    </dt>


                    <dd>
                      {formatCurrency(cancha.precio)}
                    </dd>


                  </div>


                </dl>





                <p className={styles.description}>

                  {cancha.descripcion ||
                  'Sin descripción adicional.'}

                </p>





                <button

                  type="button"

                  className={styles.secondaryButton}

                  onClick={() =>
                    void handleToggleEstado(cancha)
                  }

                >

                  {
                    cancha.estado === 'Mantenimiento'
                      ? 'Marcar disponible'
                      : 'Pasar a mantenimiento'
                  }


                </button>




              </article>


            ))}


          </div>


        </div>



      </div>


    </section>


  );


}