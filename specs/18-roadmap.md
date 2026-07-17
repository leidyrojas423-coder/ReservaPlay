# Spec 18: Roadmap de Desarrollo

Este documento define el plan estratégico de hitos cronológicos para completar el desarrollo y despliegue del sistema **ReservaPlay**.

---

## Hito 1: Estabilización del Core Backend (Semana 1)
- [x] Configuración de PostgreSQL y mapeo de Entidades con TypeORM.
- [x] Implementación de módulos de Autenticación (`AuthModule`) y Usuarios (`UsersModule`, `ClientesModule`).
- [x] Desarrollo y pruebas unitarias de los módulos de `Canchas` y `Horarios`.

## Hito 2: Motor transaccional de Reservas (Semana 2)
- [x] Implementación de lógica de bloqueo de reservas concurrentes (control de solapamientos).
- [x] Endpoint para consulta de disponibilidad por rangos de fecha y cancha específica.
- [x] Gestión de estados de reservas (`pendiente` -> `confirmada`/`cancelada`).

## Hito 3: Desarrollo de la Interfaz Web Frontend (Semana 3)
- [ ] Creación de la pantalla de inicio y Login/Registro adaptativo.
- [ ] Desarrollo de la vista de reserva interactiva (calendario dinámico y selector de horas libres).
- [ ] Panel de control del Cliente (Historial de reservas con opción de cancelación automática).
- [ ] Panel de control del Administrador (Dashboard con indicadores, creación de canchas, horarios y listado global de reservas).

## Hito 4: Despliegue y Pruebas Integradas (Semana 4)
- [ ] Configuración del entorno de producción.
- [ ] Despliegue de la Base de Datos PostgreSQL (ej. Supabase, AWS RDS, o Render).
- [ ] Despliegue del Backend API REST.
- [ ] Pruebas de extremo a extremo (E2E) simulando múltiples usuarios reservando simultáneamente.