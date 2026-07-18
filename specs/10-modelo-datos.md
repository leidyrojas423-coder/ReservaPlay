# Spec 10: Modelo de Datos (Coherente con el proyecto actual)

Este documento describe el modelo de datos relacional que debe mantenerse consistente con la implementación actual del backend en NestJS + TypeORM para **ReservaPlay**.

## 1. Modelo conceptual

- Un **usuario** (`users`) es la entidad base de autenticación y autorización.
- Un **cliente** (`clientes`) y un **administrador** (`administradores`) son perfiles extendidos del usuario, con datos específicos de negocio.
- Un **administrador** puede gestionar muchas **canchas**.
- Una **cancha** puede tener muchos **horarios**.
- Un **cliente** puede registrar muchas **reservas**.
- Una **reserva** se asocia a una **cancha**, a un **horario** y a un **cliente**, y su estado debe estar controlado por reglas de negocio.

> Nota de coherencia: el proyecto actual ya define `users` como entidad de autenticación y `clientes` / `administradores` como entidades adicionales. Por eso el modelo de datos debe mantener esa separación y evitar duplicar credenciales entre entidades.

---

## 2. Diccionario de datos

### Tabla: `users`
Entidad central de acceso al sistema.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Identificador único del usuario |
| `name` | VARCHAR(100) | NOT NULL | Nombre visible del usuario |
| `email` | VARCHAR(150) | UNIQUE, NOT NULL | Correo electrónico de acceso |
| `password` | VARCHAR(255) | NOT NULL | Contraseña encriptada |
| `role` | ENUM(`client`,`admin`) | NOT NULL, DEFAULT `client` | Rol del usuario |
| `profile` | TEXT | NULL | Información adicional del perfil |
| `active` | BOOLEAN | DEFAULT TRUE | Estado lógico del usuario |

---

### Tabla: `clientes`
Perfil específico para usuarios que reservan canchas.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Identificador del cliente |
| `nombre` | VARCHAR(100) | NOT NULL | Nombre del cliente |
| `apellido` | VARCHAR(100) | NOT NULL | Apellido del cliente |
| `correo` | VARCHAR(150) | UNIQUE, NOT NULL | Correo de contacto del cliente |
| `telefono` | VARCHAR(20) | NOT NULL | Teléfono de contacto |
| `password` | VARCHAR(255) | NOT NULL | Contraseña del perfil cliente |
| `estado` | BOOLEAN | DEFAULT TRUE | Estado activo/inactivo del cliente |
| `fecha_registro` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |

---

### Tabla: `administradores`
Perfil específico para gestores del sistema.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Identificador del administrador |
| `nombre` | VARCHAR(100) | NOT NULL | Nombre del administrador |
| `apellido` | VARCHAR(100) | NOT NULL | Apellido del administrador |
| `correo` | VARCHAR(150) | UNIQUE, NOT NULL | Correo de contacto |
| `telefono` | VARCHAR(20) | NOT NULL | Teléfono de contacto |
| `password` | VARCHAR(255) | NOT NULL | Contraseña del perfil administrador |
| `estado` | BOOLEAN | DEFAULT TRUE | Estado activo/inactivo del administrador |
| `fecha_registro` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |

---

### Tabla: `canchas`
Representa cada cancha disponible para reserva.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Identificador único de la cancha |
| `nombre` | VARCHAR(100) | NOT NULL | Nombre de la cancha |
| `descripcion` | VARCHAR(250) | NULL | Descripción general |
| `ubicacion` | VARCHAR(100) | NOT NULL | Ubicación o sede |
| `estado` | VARCHAR(50) | DEFAULT `Disponible` | Estado operativo de la cancha |
| `capacidad` | INT | NULL | Capacidad máxima de jugadores o personas |
| `precio` | DECIMAL(10,2) | NULL | Precio por hora o tarifa base |
| `activo` | BOOLEAN | DEFAULT TRUE | Estado lógico de disponibilidad |
| `administradorId` | UUID | FK (`administradores.id`) | Administrador responsable |
| `fecha_registro` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de registro |

---

### Tabla: `horarios`
Define los intervalos de tiempo asociados a cada cancha.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Identificador del horario |
| `nombre` | VARCHAR(100) | NOT NULL | Nombre del bloque horario |
| `descripcion` | VARCHAR(200) | NULL | Descripción del bloque |
| `fechaInicio` | TIMESTAMP WITH TIME ZONE | NOT NULL | Fecha y hora de inicio |
| `fechaFin` | TIMESTAMP WITH TIME ZONE | NOT NULL | Fecha y hora de fin |
| `activo` | BOOLEAN | DEFAULT TRUE | Estado lógico del horario |
| `canchaId` | UUID | FK (`canchas.id`) | Cancha a la que pertenece la disponibilidad |
| `fecha_registro` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |

---

### Tabla: `reservas`
Registra la solicitud o confirmación de una reserva de una cancha.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Identificador único de la reserva |
| `clienteId` | UUID | FK (`clientes.id`) | Cliente que realiza la reserva |
| `canchaId` | UUID | FK (`canchas.id`) | Cancha reservada |
| `horarioId` | UUID | FK (`horarios.id`) | Bloque horario elegido |
| `fechaReserva` | TIMESTAMP | NOT NULL | Fecha de uso de la cancha |
| `estado` | VARCHAR(50) | DEFAULT `pendiente` | Estado de la reserva |
| `fecha_registro` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha en la que se creó la reserva |

---

## 3. Reglas de integridad y coherencia

1. **Una sola fuente de autenticación**: `users` debe ser la entidad base para login y roles; `clientes` y `administradores` solo deben almacenar información adicional del perfil.
2. **Relación 1:1 con perfil**: cada cliente y administrador debe estar asociado a un usuario base de forma consistente.
3. **No duplicar credenciales**: no se deben guardar `email/password` redundantes en perfiles si ya existen en `users`.
4. **Control de disponibilidad**: una cancha no puede tener dos reservas activas para el mismo `horarioId` y la misma fecha de uso.
5. **Inactivación lógica**: si una cancha o un horario deja de estar disponible, no se elimina físicamente de inmediato; se marca con `activo = false` o `estado` correspondiente.
6. **Validación temporal**: `fechaFin` debe ser mayor que `fechaInicio`.
7. **Estado normalizado**: los valores de `estado` deben mantenerse en un conjunto controlado y documentado (`pendiente`, `confirmada`, `cancelada`, `rechazada`, etc.).

## 4. Recomendación de mantenimiento

Para mantener consistencia con el proyecto, cada cambio en el modelo de datos debe reflejarse en:
- las entidades TypeORM,
- los DTOs,
- los servicios y validaciones,
- y la documentación del spec.

Esto evita que el modelo conceptual y el modelo implementado diverjan.