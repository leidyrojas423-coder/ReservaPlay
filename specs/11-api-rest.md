# Spec 11: API REST Endpoints (Coherente con el proyecto actual)

Este documento describe la API REST del backend de **ReservaPlay** con base en los controladores reales de NestJS. Debe mantenerse alineado con la implementación actual para evitar que la documentación describa rutas que no existen o permisos que no están aplicados.

> Nota de coherencia: la API actual ya está definida en los controladores de `auth`, `users`, `clientes`, `administradores`, `canchas`, `horarios` y una estructura vacía en `reservas`. Por ello el spec debe reflejar el estado real del backend y diferenciar claramente entre endpoints existentes, protegidos y pendientes.

### Estado general de la API
- `auth`: implementado y con JWT.
- `users`: implementado parcialmente con perfil autenticado.
- `clientes`: implementado como CRUD básico, sin protección por guard.
- `administradores`: implementado como CRUD básico, sin protección por guard.
- `canchas`: implementado con operaciones de consulta, actualización y desactivación.
- `horarios`: implementado con CRUD y desactivación.
- `reservas`: pendiente de implementación funcional.

---

## 1. Módulo de autenticación (`/auth`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Público | Autentica un usuario con email y password y devuelve un JWT. |
| `POST` | `/auth/admin/login` | Público | Login específico para administradores. |
| `GET` | `/auth/me` | Autenticado | Devuelve información del usuario autenticado. Requiere `JwtAuthGuard` y rol `client` o `admin`. |
| `GET` | `/auth/admin/dashboard` | Admin | Endpoint administrativo de prueba/panel de control. Es un recurso interno de validación del rol administrador. |

---

## 2. Módulo de usuarios (`/users`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/users/register` | Público | Registra un nuevo usuario base en el sistema. |
| `GET` | `/users/me` | Autenticado | Obtiene el perfil del usuario autenticado. |
| `PATCH` | `/users/me` | Autenticado | Actualiza el perfil del usuario autenticado. |

---

## 3. Módulo de clientes (`/clientes`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/clientes` | Público | Crea un cliente. |
| `GET` | `/clientes` | Público | Lista los clientes registrados. |
| `PUT` | `/clientes/:id` | Público | Actualiza un cliente por su ID. |
| `DELETE` | `/clientes/:id` | Público | Elimina un cliente por su ID. |

> Observación: en la implementación actual estos endpoints no usan guard de autenticación. El spec debe documentar esta condición para evitar suposiciones de seguridad.

---

## 4. Módulo de administradores (`/administradores`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/administradores` | Público | Crea un administrador. |
| `GET` | `/administradores` | Público | Lista administradores. |
| `DELETE` | `/administradores/:id` | Público | Elimina un administrador por su ID. |

---

## 5. Módulo de canchas (`/canchas`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/canchas` | Admin | Registra una nueva cancha. |
| `GET` | `/canchas` | Público | Lista todas las canchas. |
| `GET` | `/canchas/disponibles` | Público | Lista canchas disponibles con el estado correspondiente. |
| `GET` | `/canchas/disponibilidad` | Público | Consulta disponibilidad de canchas según filtros. |
| `PUT` | `/canchas/:id` | Admin | Actualiza una cancha por su ID. |
| `PATCH` | `/canchas/:id/desactivar` | Admin | Desactiva lógicamente una cancha. |
| `DELETE` | `/canchas/:id` | Admin | Elimina una cancha. |

---

## 6. Módulo de horarios (`/horarios`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/horarios` | Admin | Crea un bloque horario asociado a una cancha. |
| `GET` | `/horarios` | Público | Lista todos los horarios. |
| `GET` | `/horarios/cancha/:canchaId` | Público | Lista horarios asociados a una cancha. |
| `PUT` | `/horarios/:id` | Admin | Actualiza un horario por su ID. |
| `PATCH` | `/horarios/:id/desactivar` | Admin | Desactiva lógicamente un horario. |
| `DELETE` | `/horarios/:id` | Admin | Elimina un horario por su ID. |

---

## 7. Módulo de reservas (`/reservas`)

Actualmente el controlador de reservas está vacío y no expone endpoints funcionales. Por tanto, el spec debe tratarlas como una parte pendiente del proyecto y no documentarlas como rutas ya implementadas.

### Estado actual recomendado

El módulo de reservas se encuentra vacío en el controlador actual. Por lo tanto, las rutas de abajo deben considerarse como requisitos pendientes, no como endpoints ya expuestos por la aplicación.

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/reservas` | Cliente | Pendiente: crear una reserva. |
| `GET` | `/reservas/mis-reservas` | Cliente | Pendiente: listar reservas del cliente autenticado. |
| `GET` | `/reservas/todas` | Admin | Pendiente: listar reservas del sistema. |
| `PATCH` | `/reservas/:id/estado` | Admin/Cliente | Pendiente: actualizar el estado de la reserva. |

---

## 8. Formato de respuestas estándar

### Respuesta de éxito
```json
{
  "statusCode": 200,
  "message": "Login exitoso",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "email": "cliente@reservaplay.com",
      "role": "client"
    }
  }
}
```

### Respuesta de error estándar
```json
{
  "statusCode": 401,
  "message": "Credenciales inválidas",
  "error": "Unauthorized"
}
```

---

## 9. Reglas de coherencia para mantener el spec actualizado

1. El spec debe reflejar los controladores existentes y no documentar rutas que aún no estén implementadas.
2. Los permisos deben coincidir con los decorators usados en NestJS (`@UseGuards`, `@Roles`).
3. Las rutas de acceso y parámetros deben usar el mismo nombre que aparece en los controladores (`:id`, `:canchaId`).
4. Si un módulo queda vacío o incompleto, debe declararse como `pendiente` o `en desarrollo`.
5. Cada cambio en el backend debe actualizar este spec para mantener la trazabilidad con los requisitos base.
6. En esta versión de proyecto no se usa versionado de API (`/api/v1`) ni prefijos adicionales; por tanto, el spec debe documentar las rutas tal como están expuestas actualmente.
