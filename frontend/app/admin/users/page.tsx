'use client';

import { useEffect, useState } from 'react';
import { getStoredAuthToken } from '../../../lib/auth';
import styles from './styles.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profile?: string;
  active: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredAuthToken();
    if (!token) {
      setError('Debe iniciar sesión como administrador.');
      setLoading(false);
      return;
    }

    fetch('http://localhost:3000/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'No autorizado');
        }
        return response.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1>Administración de Usuarios</h1>
          <p>Lista de usuarios registrados en ReservaPlay.</p>
        </div>

        {loading ? (
          <p>Cargando usuarios...</p>
        ) : error ? (
          <p className={styles.loginError}>{error}</p>
        ) : (
          <div className={styles.userTable}>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Activo</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.active ? 'Sí' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
