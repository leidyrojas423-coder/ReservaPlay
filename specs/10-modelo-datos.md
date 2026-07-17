# Spec 10: Modelo de Datos (PostgreSQL)

Este documento describe la estructura de la base de datos relacional en PostgreSQL para el sistema **ReservaPlay**.

## 1. Diagrama Entidad-Relación (Conceptual)

- Un **Usuario (User)** puede ser de tipo `Cliente` o `Administrador` (herencia o relación 1:1).
- Un **Administrador** gestiona muchas **Canchas**.
- Una **Cancha** tiene muchos **Horarios** disponibles.
- Un **Cliente** puede realizar muchas **Reservas**.
- Una **Reserva** pertenece a un **Cliente**, se realiza para una **Cancha** en un **Horario** específico y tiene un **Estado**.

---

## 2. Diccionario de Datos (Tablas)

### Tabla: `users`
Almacena las credenciales de acceso comunes y la información base de autenticación.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Default: `uuid_generate_v4()` | Identificador único del usuario |
| `email` | VARCHAR(150) | UNIQUE, NOT NULL | Correo electrónico de acceso |
| `password` | VARCHAR(255) | NOT NULL | Contraseña encriptada (Hash) |
| `role` | VARCHAR(50) | NOT NULL | Rol en el sistema (`cliente`, `administrador`) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de registro |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Última actualización |

---

### Tabla: `clientes`
Almacena la información específica de los usuarios que reservan canchas.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, FK (`users.id`) | Relación uno a uno con la tabla `users` |
| `nombre` | VARCHAR(100) | NOT NULL | Nombre completo del cliente |
| `telefono` | VARCHAR(20) | NULL | Teléfono de contacto |

---

### Tabla: `administradores`
Almacena la información específica de los gestores de los escenarios deportivos.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, FK (`users.id`) | Relación uno a uno con la tabla `users` |
| `nombre` | VARCHAR(100) | NOT NULL | Nombre del administrador |
| `cargo` | VARCHAR(100) | NULL | Cargo o nivel de acceso administrativo |

---

### Tabla: `canchas`
Almacena la información de los campos de juego disponibles.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Default: `uuid_generate_v4()` | Identificador único de la cancha |
| `nombre` | VARCHAR(100) | NOT NULL | Nombre de la cancha (Ej: "Cancha Sintética F8") |
| `tipo` | VARCHAR(50) | NOT NULL | Tipo de cancha (Fútbol 5, Tenis, etc.) |
| `precio_hora` | DECIMAL(10,2) | NOT NULL | Precio de alquiler por hora |
| `activa` | BOOLEAN | DEFAULT TRUE | Estado de disponibilidad general |

---

### Tabla: `horarios`
Define los bloques de tiempo en los que se puede reservar una cancha.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Default: `uuid_generate_v4()` | Identificador único del horario |
| `cancha_id` | UUID | FK (`canchas.id`), NOT NULL | Cancha asociada al horario |
| `dia_semana` | INT | NOT NULL (0 = Domingo, 6 = Sábado) | Día de la semana en que aplica |
| `hora_inicio` | TIME | NOT NULL | Hora en que inicia el bloque |
| `hora_fin` | TIME | NOT NULL | Hora en que finaliza el bloque |

---

### Tabla: `reservas`
Registra el alquiler de una cancha por parte de un cliente en un horario específico.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Default: `uuid_generate_v4()` | Identificador único de la reserva |
| `cliente_id` | UUID | FK (`clientes.id`), NOT NULL | Cliente que realiza la reserva |
| `cancha_id` | UUID | FK (`canchas.id`), NOT NULL | Cancha reservada |
| `horario_id` | UUID | FK (`horarios.id`), NOT NULL | Bloque horario seleccionado |
| `fecha_reserva` | DATE | NOT NULL | Fecha en la que se usará la cancha |
| `estado` | VARCHAR(50) | DEFAULT 'pendiente' | Estado (`pendiente`, `confirmada`, `cancelada`) |
| `total_pago` | DECIMAL(10,2) | NOT NULL | Valor total cobrado por la reserva |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación de la reserva |

---

## 3. Integridad y Reglas del Modelo

1. **Eliminación en Cascada limitada**: Si se elimina un usuario, se debe eliminar en cascada su registro asociado en `clientes` o `administradores`. Sin embargo, un `horario` o una `reserva` no deberían eliminarse si la cancha tiene histórico; en su lugar, se manejan estados de inactivación lógica.
2. **Restricción de Unicidad Temporal**: Una cancha no puede tener dos reservas `confirmadas` para el mismo `fecha_reserva` y `horario_id`.