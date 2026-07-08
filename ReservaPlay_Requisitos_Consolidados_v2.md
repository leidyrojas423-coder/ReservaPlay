# ReservaPlay
## Documento Consolidado de Requisitos (Versión Revisada)

> **Versión:** 2.0  
> **Estado:** Revisado y normalizado

# 1. Nombre del proyecto

**ReservaPlay**: Plataforma web para la administración y reserva de canchas sintéticas.

---

# 2. Objetivo

Desarrollar una plataforma web que permita a los administradores gestionar múltiples canchas sintéticas y a los clientes consultar disponibilidad y realizar reservas mediante autenticación.

---

# 3. Alcance del MVP

Incluye:

- Registro e inicio de sesión de clientes.
- Inicio de sesión de administradores.
- Administración de múltiples canchas.
- Configuración de horarios.
- Consulta de disponibilidad.
- Creación de reservas.
- Confirmación manual del pago por parte del administrador.
- Cambio de estado de las reservas.
- Historial de reservas del cliente.

No incluye:

- Pasarela de pagos.
- Notificaciones automáticas.
- Aplicación móvil.
- Reportes avanzados.

---

# 4. Roles

## Cliente

Puede:

- Registrarse.
- Iniciar sesión.
- Consultar canchas.
- Buscar horarios disponibles.
- Crear reservas.
- Consultar su historial.
- Cancelar reservas pendientes.

## Administrador

Puede:

- Iniciar sesión.
- Crear, editar y desactivar canchas.
- Configurar horarios.
- Consultar todas las reservas.
- Confirmar manualmente el pago.
- Confirmar, finalizar o cancelar reservas.
- Cambiar el estado de una cancha.

---

# 5. Estados

## Estado de la cancha

- Disponible
- Ocupada
- Mantenimiento

## Estado de la reserva

- Pendiente
- Confirmada
- Finalizada
- Cancelada

Flujo:

Pendiente → Confirmada → Finalizada

o

Pendiente → Cancelada

Confirmada → Cancelada

---

# 6. Modelo conceptual

Administrador
    │
    ├── Cancha (1..N)
            │
            ├── Horario (1..N)
                    │
                    └── Reserva (0..1)

Cliente
    └── Reserva (1..N)

Cada reserva pertenece a un cliente y a un horario.

---

# 7. Reglas de negocio

RN-01 Cliente registrado para reservar.

RN-02 Un cliente puede tener múltiples reservas.

RN-03 Cada cancha pertenece a un administrador.

RN-04 Cada cancha posee múltiples horarios.

RN-05 Cada horario pertenece a una única cancha.

RN-06 Cada horario admite como máximo una reserva activa.

RN-07 Toda reserva inicia en estado Pendiente.

RN-08 El administrador confirma manualmente el pago y cambia el estado a Confirmada.

RN-09 Flujo permitido:
Pendiente → Confirmada → Finalizada
Pendiente → Cancelada
Confirmada → Cancelada

RN-10 No se permiten reservas en horarios ocupados ni en canchas en mantenimiento.

RN-11 No se permiten horarios solapados para una misma cancha.

RN-12 Solo el administrador puede administrar canchas, horarios y reservas.

RN-13 El cliente solo puede consultar y administrar sus propias reservas.

---

# 8. Matriz de permisos

| Acción | Cliente | Administrador |
|---------|:-------:|:-------------:|
| Registrarse | ✅ | ❌ |
| Iniciar sesión | ✅ | ✅ |
| Consultar canchas | ✅ | ✅ |
| Buscar disponibilidad | ✅ | ✅ |
| Crear reserva | ✅ | ❌ |
| Ver mis reservas | ✅ | ❌ |
| Cancelar reserva propia | ✅ | ❌ |
| Crear cancha | ❌ | ✅ |
| Editar cancha | ❌ | ✅ |
| Cambiar estado de cancha | ❌ | ✅ |
| Crear horarios | ❌ | ✅ |
| Editar horarios | ❌ | ✅ |
| Confirmar pago | ❌ | ✅ |
| Confirmar reserva | ❌ | ✅ |
| Cancelar cualquier reserva | ❌ | ✅ |
| Consultar todas las reservas | ❌ | ✅ |

---

# 9. Entidades principales

- Administrador
- Cliente
- Cancha
- Horario
- Reserva

Relaciones:

- Administrador 1:N Cancha
- Cancha 1:N Horario
- Cliente 1:N Reserva
- Horario 1:0..1 Reserva activa

---

# 10. Tecnologías

Frontend:
- HTML5
- CSS3
- JavaScript

Backend:
- Node.js
- NestJS
- TypeScript

Base de datos:
- PostgreSQL

Herramientas:
- Visual Studio Code
- DBeaver
- Git
- GitHub
- Postman

---

# 11. Casos borde identificados

- Reservas simultáneas.
- Horarios solapados.
- Reserva sobre cancha en mantenimiento.
- Cancelación de reservas.
- Eliminación de horarios con reservas.
- Modificación de reservas finalizadas.
- Fechas pasadas.
- Edición simultánea por administradores.

---

# 12. Arquitectura

Arquitectura de tres capas:

Frontend → Backend (NestJS) → PostgreSQL

Diseño modular preparado para futuras integraciones:
- Pagos en línea.
- Notificaciones.
- Reportes.
- Aplicación móvil.
