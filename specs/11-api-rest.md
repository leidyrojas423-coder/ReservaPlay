# Spec 11: API REST Endpoints

Este documento detalla la estructura de la API REST para el sistema **ReservaPlay**, mapeada a partir de los módulos del código NestJS. Todos los endpoints de recursos protegidos requieren un token JWT en el encabezado `Authorization: Bearer <token>`.

---

## 1. Módulo de Autenticación (`/auth`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Público | Autentica un usuario (Cliente/Admin) y retorna el token JWT junto con el rol. |

---

## 2. Módulo de Usuarios y Clientes (`/users` y `/clientes`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/users` | Público | Registro inicial de un usuario (crea credenciales básicas). |
| `GET` | `/clientes/perfil` | Cliente | Obtiene los datos del perfil del cliente autenticado. |
| `PUT` | `/clientes/perfil` | Cliente | Actualiza la información personal del cliente (nombre, teléfono). |

---

## 3. Módulo de Administradores y Canchas (`/administradores` y `/canchas`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/canchas` | Admin | Registra una nueva cancha en el sistema. |
| `GET` | `/canchas` | Público | Lista todas las canchas disponibles (filtro opcional por tipo). |
| `GET` | `/canchas/:id` | Público | Obtiene los detalles específicos de una cancha por su ID. |
| `PUT` | `/canchas/:id` | Admin | Modifica los datos o desactiva de forma lógica una cancha. |
| `DELETE` | `/canchas/:id` | Admin | Elimina una cancha (siempre que no tenga reservas asociadas). |

---

## 4. Módulo de Horarios (`/horarios`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/horarios` | Admin | Define un bloque de tiempo de alquiler para una cancha específica. |
| `GET` | `/horarios/cancha/:canchaId`| Público | Consulta todos los bloques de horarios configurados para una cancha. |
| `DELETE` | `/horarios/:id` | Admin | Remueve un bloque horario. |

---

## 5. Módulo de Reservas (`/reservas`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/reservas` | Cliente | Crea una nueva solicitud de reserva adjuntando fecha, cancha y horario. |
| `GET` | `/reservas/mis-reservas`| Cliente | Obtiene el historial completo de reservas realizadas por el cliente autenticado. |
| `GET` | `/reservas/todas` | Admin | Permite al administrador visualizar todas las reservas del sistema (con filtros). |
| `PATCH` | `/reservas/:id/estado` | Admin/Cliente| Modifica el estado de la reserva (`confirmada` o `cancelada` siguiendo las reglas del negocio). |

---

## 6. Formato de Respuestas Estándar

### Respuesta Exitosa (Ejemplo: `POST /auth/login`)
```json
{
  "statusCode": 200,
  "message": "Login exitoso",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "email": "cliente@reservaplay.com",
      "role": "cliente"
    }
  }
}