# Spec 13: Requisitos Funcionales (Coherente con el proyecto actual)

Este documento describe los requisitos funcionales del sistema **ReservaPlay** en función de la implementación actual del backend. Debe mantenerse alineado con los módulos ya desarrollados en NestJS y con los módulos todavía pendientes de completar.

> Nota de coherencia: la base de autenticación está en `users`; `clientes` y `administradores` son perfiles complementarios, y `canchas` y `horarios` ya tienen lógica de negocio implementada. El módulo de reservas sigue pendiente, por lo que sus requisitos deben verse como flujo futuro y no como funcionalidad ya entregada.

---

## RF-01: Autenticación y registro de usuarios
- **RF-01.1:** El sistema debe permitir registrar un usuario base con `name`, `email`, `password` y `role`.
- **RF-01.2:** El sistema debe permitir iniciar sesión con credenciales válidas y devolver un JWT para uso en endpoints protegidos.
- **RF-01.3:** El acceso administrativo debe restringirse a usuarios con rol `admin` mediante guard de autenticación y roles.
- **RF-01.4:** El sistema debe permitir consultar el perfil autenticado mediante `GET /users/me` y actualizarlo mediante `PATCH /users/me`.

## RF-02: Gestión de canchas
- **RF-02.1:** El sistema debe permitir a los administradores registrar nuevas canchas, indicando al menos `nombre`, `ubicacion`, `estado`, `precio` y `administradorId`.
- **RF-02.2:** El administrador debe poder modificar la información de una cancha existente mediante `PUT /canchas/:id`.
- **RF-02.3:** El administrador debe poder desactivar una cancha de forma lógica y cambiar su estado a `Mantenimiento`.
- **RF-02.4:** El sistema debe listar canchas activas y consultar disponibilidad por fecha y rango horario.

## RF-03: Gestión de disponibilidad y horarios
- **RF-03.1:** El administrador debe poder crear horarios con `fechaInicio`, `fechaFin`, `canchaId` y `activo`.
- **RF-03.2:** El sistema debe evitar solapamientos de horarios en la misma cancha.
- **RF-03.3:** El sistema debe permitir listar horarios por cancha y consultar disponibilidad en una fecha específica.
- **RF-03.4:** El administrador debe poder desactivar un horario sin eliminarlo físicamente.

## RF-04: Motor de reservas
- **RF-04.1:** El sistema debe permitir a un cliente autenticado seleccionar una cancha y un horario disponible para agendar una reserva.
- **RF-04.2:** La lógica de reservas debe validar disponibilidad, evitando conflictos en horarios ya ocupados.
- **RF-04.3:** El sistema debe registrar la reserva con un estado controlado y coherente con la entidad `ReservaEntity`.
- **RF-04.4:** El módulo de reservas está pendiente de implementación funcional en el proyecto actual; por tanto, estas reglas deben considerarse como requisitos planificados y no como endpoints ya operativos.

## RF-05: Historial y cancelación de reservas
- **RF-05.1:** El cliente debería poder consultar su historial de reservas activas y pasadas desde un panel o flujo específico.
- **RF-05.2:** El sistema debería permitir cancelar reservas en función de una ventana temporal de anticipación.
- **RF-05.3:** La cancelación administrativa debe quedar reservada para usuarios con rol `admin` y debe estar sujeta a validaciones de negocio.
- **RF-05.4:** En la versión actual del proyecto, estos requisitos aún no están implementados en `ReservasService` ni en el controlador `reservas`.

---

## RF-06: Coherencia entre requisitos y código

1. Los requisitos funcionales deben estar alineados con las rutas y permisos reales definidos en la API.
2. Los módulos ya implementados en NestJS deben tomarse como base para los requisitos vigentes.
3. Los módulos pendientes deben declararse explícitamente como requisitos de desarrollo futuro.
4. Cada requisito funcional debe poder ser trazado hacia un controlador, servicio o DTO del proyecto.