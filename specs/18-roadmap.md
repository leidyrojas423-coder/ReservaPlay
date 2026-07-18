# Spec 18: Roadmap de Desarrollo

Este documento define el plan estratégico de hitos cronológicos para completar el desarrollo y despliegue del sistema **ReservaPlay**, manteniendo coherencia con la implementación real del backend.

> Nota de coherencia: el proyecto ya cuenta con módulos de autenticación, clientes, administradores, canchas y horarios. El módulo de reservas sigue siendo parcialmente implementado. Por eso, el roadmap debe diferenciar claramente entre funcionalidades ya disponibles, pendientes y futuras.

---

## Hito 1: Base del backend y autenticación (Semana 1)
- [x] Configuración de PostgreSQL y conexión con TypeORM.
- [x] Implementación del módulo `AuthModule` con login JWT.
- [x] Implementación de `UsersModule`, `ClientesModule` y `AdministradoresModule`.
- [x] Exposición de endpoints de canchas y disponibilidad.
- [x] Registro de horarios y gestión básica por cancha.

## Hito 2: Cierre del flujo de reservas (Semana 2)
- [ ] Implementación del flujo completo de creación de reservas.
- [ ] Validación real de disponibilidad y bloqueo de solapamientos.
- [ ] Persistencia del estado de reserva (`pendiente`, `confirmada`, `cancelada`) con flujo completo de negocio.
- [ ] Endpoints CRUD y consulta para reservas con trazabilidad real.

## Hito 3: Frontend y experiencia de usuario (Semana 3)
- [ ] Creación de la pantalla de inicio y autenticación adaptativa.
- [ ] Desarrollo de la vista de consulta de disponibilidad y reserva interactiva.
- [ ] Panel del cliente para historial y cancelación.
- [ ] Panel administrativo con dashboard, creación de canchas, horarios y gestión de reservas.

## Hito 4: Despliegue y validación integrada (Semana 4)
- [ ] Configuración del entorno de producción.
- [ ] Despliegue de la base de datos PostgreSQL.
- [ ] Despliegue del backend API REST.
- [ ] Pruebas E2E con múltiples usuarios y validación de concurrencia.

---

## 5. Estado real del proyecto

### Actualmente soportado en backend
- autenticación con JWT,
- roles y guards,
- CRUD de clientes, administradores, canchas y horarios,
- consulta de disponibilidad por filtros.

### Pendiente para cerrar el MVP
- implementación completa del módulo de reservas,
- validación de solapamiento en creación de reservas,
- flujo de cancelación y actualización de estado con lógica de negocio real,
- despliegue y pruebas de integración.

---

## 6. Recomendaciones de ejecución

1. El roadmap debe mantenerse sincronizado con lo que ya existe en código y no con lo que se quiere construir en futuras iteraciones.
2. El flujo de reservas debe permanecer como hito abierto hasta que el módulo esté completamente operativo.
3. El frontend y el despliegue deben evaluarse como fases posteriores al cierre del backend funcional.
4. Cualquier cambio de prioridad en arquitectura o negocio debe reflejarse aquí para conservar trazabilidad del plan.

---

## 7. Ajustes sugeridos para cerrar la ejecución real del proyecto

- Separar el cierre del backend en dos etapas: `base estable` y `flujo de reservas completo`.
- Considerar el módulo de reservas como un hito independiente porque hoy no está expuesto como API real en el controlador.
- Incluir validaciones de `DTOs` y pruebas de integración en el hito 1, para reforzar la robustez del backend antes de abrir frontend.
- Priorizar primero la capa de negocio y la concurrencia de horarios, y después la capa de experiencia del usuario.
- Definir el despliegue como una fase de estabilización final y no como una tarea paralela del desarrollo funcional.
- Mantener una trazabilidad simple entre cada hito y los módulos ya presentes en `src/` para evitar fechas de entrega ajenas a la realidad del repo.