'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './login.module.css';
import { setStoredAuthToken } from '../../../lib/auth';


export default function AdminLoginPage() {


  const router = useRouter();

  const searchParams = useSearchParams();


  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);




  const handleSubmit = async (
    e: React.FormEvent
  ) => {


    e.preventDefault();


    setError('');

    setLoading(true);



    try {


      const response = await fetch(
        'http://localhost:3000/auth/login',
        {

          method: 'POST',

          headers: {

            'Content-Type':
              'application/json',

          },


          body: JSON.stringify({

            email,

            password,

          }),


        }
      );



      if (!response.ok) {

        throw new Error(
          'Correo o contraseña incorrectos'
        );

      }




      const data = await response.json();




      const token =
        data.access_token ||
        data.token;




      if (!token) {

        throw new Error(
          'El servidor no devolvió token de acceso'
        );

      }





      // Guarda JWT para middleware y páginas protegidas

      setStoredAuthToken(token);





      const next =
        searchParams.get('next')
        || '/admin/dashboard';




      router.push(next);





    } catch (error) {


      setError(

        error instanceof Error
          ? error.message
          : 'Error iniciando sesión'

      );



    } finally {


      setLoading(false);


    }


  };







  return (

    <main className={styles.container}>


      <form

        className={styles.form}

        onSubmit={handleSubmit}

      >



        <h1>
          ReservaPlay
        </h1>



        <h2>
          Acceso Administrador
        </h2>





        {
          error && (

            <p className={styles.error}>
              {error}
            </p>

          )
        }






        <input

          type="email"

          placeholder="Correo electrónico"

          value={email}

          onChange={
            (e) =>
              setEmail(e.target.value)
          }

          required

        />







        <input

          type="password"

          placeholder="Contraseña"

          value={password}

          onChange={
            (e) =>
              setPassword(e.target.value)
          }

          required

        />







        <button

          type="submit"

          disabled={loading}

        >

          {
            loading
            ? 'Ingresando...'
            : 'Ingresar'
          }

        </button>




      </form>


    </main>

  );

}