# Spec 15: Casos de Uso del Sistema

Este documento describe los casos de uso del sistema ReservaPlay en coherencia con la implementación actual del backend en NestJS.

> Nota de coherencia: el proyecto ya expone módulos de autenticación, clientes, administradores, canchas, horarios y un controlador base para reservas. Por tanto, este spec debe distinguir entre:
> - casos de uso ya soportados por endpoints reales,
> - casos de uso parcialmente soportados,
> - casos de uso pendientes de implementación.

---

## 1. Actores del sistema

- **Cliente:** usuario registrado que puede consultar disponibilidad, autenticarse y consultar su perfil.
- **Administrador:** usuario con permisos administrativos que gestiona canchas, horarios y configuración del sistema.
- **Sistema:** capa backend que valida autenticación, aplica roles y responde a las operaciones CRUD.

---

## 2. Casos de uso con soporte real en el backend

### CU-01: Inicio de sesión
- **Actor principal:** Cliente / Administrador
- **Ruta real:** `POST /auth/login` y `POST /auth/admin/login`
- **Precondiciones:** el usuario o administrador debe existir en el sistema y la contraseña debe ser válida.
- **Flujo principal:**
  1. El actor envía correo y contraseña al endpoint de autenticación.
  2. El backend valida las credenciales con el servicio de auth.
  3. Si la validación es correcta, retorna un token JWT.
- **Resultado esperado:** autenticación exitosa para acceder a rutas protegidas.

### CU-02: Consultar perfil autenticado
- **Actor principal:** Cliente / Administrador
- **Ruta real:** `GET /auth/me`
- **Precondiciones:** el cliente debe estar autenticado con JWT.
- **Flujo principal:**
  1. El actor envía el token JWT en la cabecera `Authorization`.
  2. El backend valida el token mediante el guard de JWT.
  3. El sistema responde con el perfil del usuario autenticado.
- **Resultado esperado:** información del usuario autenticado visible en el contexto del sistema.

### CU-03: Consultar dashboard administrativo
- **Actor principal:** Administrador
- **Ruta real:** `GET /auth/admin/dashboard`
- **Precondiciones:** el actor debe tener rol de administrador y un JWT válido.
- **Flujo principal:**
  1. El administrador realiza login con credenciales de administrador.
  2. El sistema valida el rol y permite acceso al dashboard.
- **Resultado esperado:** acceso a panel administrativo con permisos restringidos.

### CU-04: Crear, listar y gestionar clientes
- **Actor principal:** Administrador
- **Ruta real:** `POST /clientes`, `GET /clientes`, `PUT /clientes/:id`, `DELETE /clientes/:id`
- **Precondiciones:** el administrador debe estar autenticado.
- **Flujo principal:**
  1. El administrador crea un cliente con sus datos básicos.
  2. El sistema registra la entidad y permite consultar o actualizar el perfil.
- **Resultado esperado:** gestión del ciclo de vida del cliente en el backend.

### CU-05: Crear, listar y gestionar administradores
- **Actor principal:** Administrador
- **Ruta real:** `POST /administradores`, `GET /administradores`, `PUT /administradores/:id`, `DELETE /administradores/:id`
- **Precondiciones:** el actor debe contar con permisos administrativos.
- **Flujo principal:**
  1. El administrador registra otro administrador o consulta el catálogo existente.
  2. El sistema persiste los cambios en la base de datos.
- **Resultado esperado:** administración de perfiles internos del sistema.

### CU-06: Crear, listar y consultar canchas
- **Actor principal:** Administrador / Cliente
- **Ruta real:** `POST /canchas`, `GET /canchas`, `GET /canchas/disponibles`, `GET /canchas/disponibilidad`
- **Precondiciones:** la cancha debe poder crearse con datos válidos y el cliente debe poder consultar disponibilidad.
- **Flujo principal:**
  1. El administrador registra la cancha.
  2. Los clientes consultan los registros disponibles y la disponibilidad por fecha.
- **Resultado esperado:** catálogo de canchas y consulta de disponibilidad soportadas por el backend.

### CU-07: Desactivar una cancha
- **Actor principal:** Administrador
- **Ruta real:** `PATCH /canchas/:id/desactivar`
- **Precondiciones:** la cancha debe existir.
- **Flujo principal:**
  1. El administrador solicita desactivar una cancha.
  2. El sistema actualiza el estado correspondiente.
- **Resultado esperado:** la cancha deja de estar activa en el flujo habitual.

### CU-08: Crear, listar y gestionar horarios
- **Actor principal:** Administrador
- **Ruta real:** `POST /horarios`, `GET /horarios`, `GET /horarios/cancha/:canchaId`, `PUT /horarios/:id`, `PATCH /horarios/:id/desactivar`, `DELETE /horarios/:id`
- **Precondiciones:** la cancha asociada debe existir.
- **Flujo principal:**
  1. El administrador define un horario para una cancha.
  2. El sistema guarda la configuración y la expone para consultas posteriores.
- **Resultado esperado:** gestión del catálogo horario de la cancha.

---

## 3. Casos de uso pendientes o incompletos

### CU-09: Crear reserva
- **Actor principal:** Cliente
- **Estado actual:** pendiente de implementación real
- **Motivo:** el controlador `ReservasController` está declarado pero aún no define el flujo de creación de reservas.
- **Comportamiento esperado:**
  1. El cliente autenticado consulta disponibilidad.
  2. El backend valida horario libre.
  3. El sistema crea la reserva con el estado correspondiente.
- **Nota:** esta funcionalidad debe ser tratada como trabajo futuro y no como requisito ya implementado.

### CU-10: Cancelar reserva
- **Actor principal:** Cliente / Administrador
- **Estado actual:** pendiente de implementación real
- **Motivo:** el flujo de cancelación no está expuesto en el controlador de reservas.
- **Comportamiento esperado:**
  1. El cliente o administrador consulta la reserva.
  2. El sistema cambia el estado de la reserva para reflejar la cancelación.
  3. El bloque de tiempo asociado queda disponible para nuevas reservas.

---

## 4. Matriz de trazabilidad funcional

| Caso de uso | Estado | Evidencia en código |
|---|---|---|
| Autenticación y JWT | Implementado | `src/auth/auth.controller.ts` |
| Perfil autenticado | Implementado | `src/auth/auth.controller.ts` |
| CRUD de clientes | Implementado | `src/clientes/clientes.controller.ts` |
| CRUD de administradores | Implementado | `src/administradores/administradores.controller.ts` |
| CRUD de canchas | Implementado | `src/canchas/canchas.controller.ts` |
| Consulta de disponibilidad | Implementado | `src/canchas/canchas.controller.ts` |
| CRUD de horarios | Implementado | `src/horarios/horarios.controller.ts` |
| Gestión de reservas | Pendiente | `src/reservas/reservas.controller.ts` |

---

## 5. Recomendaciones de coherencia

1. Los casos de uso deben estar referenciados a rutas reales del backend y no a pantallas ausentes.
2. El flujo de reservas debe mantenerse claramente identificado como `pendiente` hasta que el módulo de reservas esté completamente desarrollado.
3. El actor de administrador debe estar asociado a rutas protegidas por roles y JWT.
4. Cualquier cambio en endpoints o permisos debe actualizar este spec para mantener la trazabilidad con el proyecto real.