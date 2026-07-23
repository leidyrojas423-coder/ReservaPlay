# Spec 10: Modelo de Datos (Coherente con el proyecto actual)

Este documento describe el modelo de datos relacional que debe mantenerse consistente con la implementación actual del backend en NestJS + TypeORM para **ReservaPlay**.

## 1. Modelo conceptual

> Nota de coherencia: el proyecto actual define `users` como entidad central de autenticación. `clientes` y `administradores` referencian `users` mediante `userId`, eliminando redundancia de credenciales.

## 1.1 Diagrama Entidad–Relación (ERD)
## 1.4 Integridad referencial

A continuación se documenta el comportamiento de las claves foráneas según la configuración actual en las entidades TypeORM. Si una acción no está explícitamente definida en la entidad, se indica como "no definida" sin asumir un comportamiento por defecto.

  - ON DELETE: no definida en la entidad.
  - ON UPDATE: no definida en la entidad.

  - ON DELETE: no definida en la entidad.
  - ON UPDATE: no definida en la entidad.

  - ON DELETE: RESTRICT (definido en la entidad).
  - ON UPDATE: no definida en la entidad.

  - ON DELETE: RESTRICT (definido en la entidad).
  - ON UPDATE: no definida en la entidad.

  - ON DELETE: RESTRICT (definido en la entidad).
  - ON UPDATE: no definida en la entidad.

  - ON DELETE: RESTRICT (definido en la entidad).
  - ON UPDATE: no definida en la entidad.

  - ON DELETE: RESTRICT (definido en la entidad).
  - ON UPDATE: no definida en la entidad.

Observación final: la documentación refleja exclusivamente las opciones explícitas presentes en las entidades TypeORM; no se han asumido valores por defecto de la base de datos ni se han aplicado cambios al modelo.

erDiagram

## 1.5 Validaciones y restricciones

La siguiente sección documenta las validaciones y restricciones definidas explícitamente en las entidades TypeORM del proyecto. No se añaden reglas que no estén presentes en el código; cuando una validación no aparece en las entidades se indica como "no definida".

- `users` (`src/users/user.entity.ts`)
  - `id`: PK UUID generado por `@PrimaryGeneratedColumn('uuid')`.
  - `name`: `@Column({ length: 100 })` → longitud máxima 100, NOT NULL (no `nullable`).
  - `email`: `@Column({ length: 150, unique: true })` → longitud máxima 150, UNIQUE, NOT NULL.
  - `password`: `@Column({ select: false })` → NOT NULL, no se incluye por defecto en selects.
  - `role`: `@Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })` → enum validado por TypeORM con valor por defecto.
  - `profile`: `@Column({ type: 'text', nullable: true })` → permite NULL.
  - `active`: `@Column({ default: true })` → boolean con valor por defecto.
  - `createdAt` / `updatedAt`: creados por `@CreateDateColumn` / `@UpdateDateColumn`.

- `clientes` (`src/clientes/entities/cliente.entity.ts`)
  - `id`: PK UUID.
  - `nombre`, `apellido`: `@Column({ length: 100 })` → longitud máxima 100, NOT NULL.
  - `telefono`: `@Column({ length: 20 })` → longitud máxima 20, NOT NULL.
  - `estado`: `@Column({ default: true })` → boolean con valor por defecto.
  - `userId`: `@Column({ type: 'uuid', unique: true })` → UUID, UNIQUE, NOT NULL.
  - `createdAt` / `updatedAt`: timestamps automáticos.

- `administradores` (`src/administradores/entities/administrador.entity.ts`)
  - `id`: PK UUID.
  - `nombre`, `apellido`: `@Column({ length: 100 })` → longitud máxima 100, NOT NULL.
  - `telefono`: `@Column({ length: 20 })` → longitud máxima 20, NOT NULL.
  - `estado`: `@Column({ default: true })` → boolean con valor por defecto.
  - `userId`: `@Column({ type: 'uuid', unique: true })` → UUID, UNIQUE, NOT NULL.
  - `createdAt` / `updatedAt`: timestamps automáticos.

- `canchas` (`src/canchas/entities/cancha.entity.ts`)
  - `id`: PK UUID.
  - `nombre`: `@Column({ length: 100 })` → longitud máxima 100, NOT NULL.
  - `descripcion`: `@Column({ length: 250, nullable: true })` → permite NULL.
  - `ubicacion`: `@Column({ length: 100 })` → longitud máxima 100, NOT NULL.
  - `capacidad`: `@Column({ type: 'int', nullable: true })` → entero, permite NULL.
  - `precio`: `@Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })` → decimal opcional con precisión y escala.
  - `activo`: `@Column({ default: true })` → boolean por defecto.
  - `administradorId`: `@Column({ type: 'uuid' })` → UUID, NOT NULL (la relación define `onDelete: 'RESTRICT'`).
  - `createdAt` / `updatedAt`: timestamps automáticos.

- `horarios` (`src/horarios/entities/horario.entity.ts`)
  - `id`: PK UUID.
  - `nombre`: `@Column({ length: 100 })` → longitud máxima 100, NOT NULL.
  - `descripcion`: `@Column({ length: 200, nullable: true })` → permite NULL.
  - `fechaInicio`, `fechaFin`: `@Column({ type: 'timestamp with time zone' })` → tipo timestamp con zona, NOT NULL.
  - `activo`: `@Column({ default: true })` → boolean por defecto.
  - `canchaId`: `@Column({ type: 'uuid' })` → UUID, NOT NULL (relación con `onDelete: 'RESTRICT'`).
  - `createdAt` / `updatedAt`: timestamps automáticos.

- `reservas` (`src/reservas/entities/reserva.entity.ts`)
  - `id`: PK UUID.
  - `clienteId`, `canchaId`, `horarioId`: `@Column({ type: 'uuid' })` → UUIDs, NOT NULL (relaciones con `onDelete: 'RESTRICT'`).
  - `fechaReserva`: `@Column({ type: 'timestamp' })` → NOT NULL.
  - `estado`: `@Column({ type: 'enum', enum: ReservaEstado, default: ReservaEstado.PENDIENTE })` → enum con valor por defecto.
  - `fechaConfirmacion`: `@Column({ type: 'timestamp', nullable: true })` → permite NULL.
  - `motivoCancelacion`: `@Column({ type: 'varchar', length: 255, nullable: true })` → permite NULL, longitud máxima 255.
  - `createdAt` / `updatedAt`: timestamps automáticos.

- Validaciones y restricciones no definidas en las entidades (documentadas explícitamente):
  - No existe en las entidades una validación/constraint que imponga `fechaFin > fechaInicio` para `horarios` (la regla de negocio está en la spec, pero no implementada como CHECK en las entidades).
  - No hay CHECKs declarados en las entidades para rangos de `capacidad`, valores de `precio` positivos, o formatos de `telefono`.
  - No se definen acciones `ON UPDATE` en las relaciones en las entidades actuales (se documenta como "no definida" en la sección de integridad referencial).

Esta sección se basa exclusivamente en las opciones y decoradores observables en las entidades TypeORM del repositorio; no se han introducido nuevas validaciones ni cambios en el código.

    UUID id PK
    VARCHAR name
    VARCHAR password
    ENUM role
    TEXT profile
  }
  CLIENTES {
    UUID id PK
    VARCHAR nombre
    VARCHAR apellido
    VARCHAR telefono
    BOOLEAN estado
  ADMINISTRADORES {
    UUID id PK
    VARCHAR nombre
    VARCHAR apellido
    VARCHAR telefono
    BOOLEAN estado
  }
  CANCHAS {
    UUID administradorId FK
    VARCHAR nombre
    VARCHAR descripcion
    INT capacidad
    DECIMAL precio
    BOOLEAN activo
  }
  HORARIOS {
    UUID id PK
    UUID canchaId FK
    VARCHAR nombre
    VARCHAR descripcion
    TIMESTAMP fechaInicio
    TIMESTAMP fechaFin
    BOOLEAN activo
  }
  RESERVAS {
    UUID id PK
    UUID clienteId FK
    UUID canchaId FK
    UUID horarioId FK
    TIMESTAMP fechaReserva
    ENUM estado
    TIMESTAMP fechaConfirmacion
    VARCHAR motivoCancelacion
  }

  USERS ||--|| CLIENTES : "tiene perfil"
  USERS ||--|| ADMINISTRADORES : "tiene perfil"
  ADMINISTRADORES ||--o{ CANCHAS : "gestiona"
  CANCHAS ||--o{ HORARIOS : "define"
  CLIENTES ||--o{ RESERVAS : "realiza"
  CANCHAS ||--o{ RESERVAS : "recibe"
  HORARIOS ||--o{ RESERVAS : "usa"
```

---

## 1.2 Cardinalidades

- `users` 1 — 1 `clientes`
  - Cada `cliente` referencia exactamente un `user` mediante `userId`.
  - Cada `user` puede tener como máximo un perfil de `cliente`.
- `users` 1 — 1 `administradores`
  - Cada `administrador` referencia exactamente un `user` mediante `userId`.
  - Cada `user` puede tener como máximo un perfil de `administrador`.
- `administradores` 1 — * `canchas`
  - Un `administrador` puede gestionar múltiples `canchas`.
  - Cada `cancha` pertenece a un solo `administrador`.
- `canchas` 1 — * `horarios`
  - Una `cancha` puede tener muchos `horarios`.
  - Cada `horario` pertenece a una sola `cancha`.
- `clientes` 1 — * `reservas`
  - Un `cliente` puede crear muchas `reservas`.
  - Cada `reserva` corresponde a un solo `cliente`.
- `canchas` 1 — * `reservas`
  - Una `cancha` puede ser usada en muchas `reservas`.
  - Cada `reserva` corresponde a una sola `cancha`.
- `horarios` 1 — * `reservas`
  - Un `horario` puede estar asociado a múltiples `reservas`.
  - Cada `reserva` referencia a un solo `horario`.

---

## 1.3 Índices

- Índices existentes detectados en las entidades actuales:
  - `users.email`: UNIQUE.
  - `clientes.userId`: UNIQUE.
  - `administradores.userId`: UNIQUE.

- Índices recomendados (documentación):
  - `canchas.administradorId` (no único).
  - `horarios.canchaId` (no único).
  - `reservas.clienteId` (no único).
  - `reservas.canchaId` (no único).
  - `reservas.horarioId` (no único).

### 1.3.1 Ejemplos SQL (documentación)

Los siguientes snippets SQL son ejemplos ilustrativos de cómo se podrían declarar los índices recomendados en la base de datos. Se incluyen únicamente como referencia documental; no forman parte de migraciones ni se aplican al código del repositorio.

```sql
-- Índice no único para buscar canchas por administrador
CREATE INDEX idx_canchas_administrador_id ON canchas (administradorId);

-- Índice no único para listar horarios por cancha
CREATE INDEX idx_horarios_cancha_id ON horarios (canchaId);

-- Índices no únicos para optimizar consultas de reservas
CREATE INDEX idx_reservas_cliente_id ON reservas (clienteId);
CREATE INDEX idx_reservas_cancha_id ON reservas (canchaId);
CREATE INDEX idx_reservas_horario_id ON reservas (horarioId);

-- Nota: los índices UNIQUE existentes (por ejemplo `users.email`, `clientes.userId`, `administradores.userId`) se gestionan desde las columnas definidas en TypeORM y no requieren CREATE INDEX adicional.
```

---

## 1.6 Convenciones de nombres y tipos

Estas convenciones resumen el estilo y los tipos empleados en las entidades TypeORM actuales y sirven como guía para mantener coherencia en futuras modificaciones (documentación únicamente, sin cambios de código):

- Nombres de tablas: `snake_case` en plural (ej. `users`, `clientes`, `administradores`, `canchas`, `horarios`, `reservas`).
- Entidades en código: `PascalCase`/singular (ej. `User`, `ClienteEntity`, `CanchaEntity`).
- Campos/columnas: `camelCase` en TypeScript y mapeados a `snake_case` en la base de datos según la convención del proyecto (las columnas definidas explícitamente en TypeORM usan names como `created_at`, `updated_at`).
- Claves primarias: `id` de tipo `UUID` con `@PrimaryGeneratedColumn('uuid')`.
- Foráneas: sufijo `Id` en camelCase en las entidades (`userId`, `administradorId`, `canchaId`, `horarioId`, `clienteId`), almacenadas como `uuid`.
- Campos de auditoría: `created_at` y `updated_at` gestionados por `@CreateDateColumn` y `@UpdateDateColumn`.
- Strings con límite: se usan `@Column({ length: N })` para `name`, `email`, `telefono`, etc.; documentar siempre la longitud máxima como parte del DTO/validación.
- Enums: definidos con `@Column({ type: 'enum', enum: EnumType, default: ... })` y documentados en el spec (`UserRole`, `ReservaEstado`).
- Tipos numéricos: `precio` se modela con `decimal(10,2)`, `capacidad` con `int` cuando aplica.
- Booleanos: campos lógicos (`active`, `activo`, `estado`) con `@Column({ default: true })` cuando procede.
- Nullable: las columnas opcionales usan `nullable: true` explícito (ej. `descripcion`, `precio`, `capacidad`, `fechaConfirmacion`, `motivoCancelacion`).

Seguir estas convenciones ayuda a mantener claridad entre el modelo conceptual, las entidades TypeORM y la base de datos.

---

## 2. Diccionario de datos
## 1.7 Control de solapamiento de reservas

- Regla de negocio (definida en el spec del proyecto):
  - No puede haber dos reservas con `estado = 'confirmada'` para la misma `canchaId` cuyas fechas de uso se solapen con los horarios registrados.

- Campos del modelo disponibles para evaluar solapamientos:
  - `reservas`: `id`, `clienteId`, `canchaId`, `horarioId`, `fechaReserva`, `estado`.
  - `horarios`: `id`, `canchaId`, `fechaInicio`, `fechaFin`.

- Observaciones derivadas del modelo actual:
  - El modelo contiene los campos necesarios para detectar solapamientos, pero no existe en las entidades TypeORM un constraint a nivel de base de datos (CHECK, UNIQUE o EXCLUSION) que impida solapamientos.
  - No hay en las entidades un CHECK que garantice `fechaFin > fechaInicio` para `horarios` (esa regla está en la spec pero no en el modelo implementado).
  - Dado lo anterior, la prevención y resolución de solapamientos recaen en la capa de negocio/servicios; el repositorio actual no impone la restricción en las entidades.

- Consideración sobre estados de reserva:
  - Según la especificación, solamente las reservas con `estado = 'confirmada'` deben bloquear un intervalo. Reservas en otros estados (`pendiente`, `cancelada`, `rechazada`, `completada`) no se consideran para bloqueo de horario.

- Nota técnica (documental, no implementativa):
  - La comprobación de solapamiento se realiza comparando los intervalos de tiempo asociados (por `horarioId` o con `fechaReserva` según la lógica de negocio). El modelo actual facilita la comparación pero no la impone.


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
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Última actualización |

---

### Tabla: `clientes`
Perfil específico para usuarios que reservan canchas.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Identificador del cliente |
| `nombre` | VARCHAR(100) | NOT NULL | Nombre del cliente |
| `apellido` | VARCHAR(100) | NOT NULL | Apellido del cliente |
| `telefono` | VARCHAR(20) | NOT NULL | Teléfono de contacto |
| `estado` | BOOLEAN | DEFAULT TRUE | Estado activo/inactivo del cliente |
| `userId` | UUID | FK (`users.id`), NOT NULL | Referencia al usuario de autenticación |
| `fecha_registro` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |

---

### Tabla: `administradores`
Perfil específico para gestores del sistema.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Identificador del administrador |
| `nombre` | VARCHAR(100) | NOT NULL | Nombre del administrador |
| `apellido` | VARCHAR(100) | NOT NULL | Apellido del administrador |
| `telefono` | VARCHAR(20) | NOT NULL | Teléfono de contacto |
| `estado` | BOOLEAN | DEFAULT TRUE | Estado activo/inactivo del administrador |
| `userId` | UUID | FK (`users.id`), NOT NULL, UNIQUE | Referencia única al usuario de autenticación |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Última actualización |

---

### Tabla: `canchas`
Representa cada cancha disponible para reserva.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Identificador único de la cancha |
| `nombre` | VARCHAR(100) | NOT NULL | Nombre de la cancha |
| `descripcion` | VARCHAR(250) | NULL | Descripción general |
| `ubicacion` | VARCHAR(100) | NOT NULL | Ubicación o sede |
| `capacidad` | INT | NULL | Capacidad máxima de jugadores o personas |
| `precio` | DECIMAL(10,2) | NULL | Precio por hora o tarifa base |
| `activo` | BOOLEAN | DEFAULT TRUE | Estado lógico de disponibilidad |
| `administradorId` | UUID | FK (`administradores.id`), NOT NULL | Administrador responsable |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Última actualización |

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
| `canchaId` | UUID | FK (`canchas.id`), NOT NULL | Cancha a la que pertenece la disponibilidad |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Última actualización |

---

### Tabla: `reservas`
Registra la solicitud o confirmación de una reserva de una cancha.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Identificador único de la reserva |
| `clienteId` | UUID | FK (`clientes.id`), NOT NULL | Cliente que realiza la reserva |
| `canchaId` | UUID | FK (`canchas.id`), NOT NULL | Cancha reservada |
| `horarioId` | UUID | FK (`horarios.id`), NOT NULL | Bloque horario elegido |
| `fechaReserva` | TIMESTAMP | NOT NULL | Fecha de uso de la cancha |
| `estado` | ENUM(`pendiente`,`confirmada`,`cancelada`,`rechazada`,`completada`) | NOT NULL, DEFAULT `pendiente` | Estado de la reserva |
| `fecha_confirmacion` | TIMESTAMP | NULL | Fecha en la que se confirmó la reserva |
| `motivo_cancelacion` | VARCHAR(255) | NULL | Motivo de la cancelación (si aplica) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Última actualización |

---

## 3. Enums y valores normalizados

### Estados de reserva
- `pendiente`: Reserva creada, aguardando confirmación del administrador
- `confirmada`: Reserva aprobada y activa
- `cancelada`: Cancelada por el cliente o el administrador
- `rechazada`: Rechazada por el administrador
- `completada`: Reserva finalizada después de la fecha de uso

### Estados de usuario
- `active = true`: Usuario operacional
- `active = false`: Usuario desactivado (soft delete)

### Estados de entidades
- Clientes/Administradores: `estado` BOOLEAN (activo/inactivo)
- Canchas/Horarios: `activo` BOOLEAN (disponible/no disponible)

---

## 4. Reglas de integridad y coherencia

1. **Una sola fuente de autenticación**: `users` es la entidad base para login y roles; `clientes` y `administradores` referencian `users` mediante `userId` UNIQUE.
2. **Relación 1:1 con perfil**: cada usuario en `users` tiene como máximo un perfil en `clientes` o `administradores` (garantizado por UNIQUE en `userId`).
3. **Sin duplicación de credenciales**: `email` y `password` solo se almacenan en `users`; `clientes` y `administradores` no contienen estos datos.
4. **Integridad referencial**: Todas las FKs son NOT NULL y referencias activas (salvo casos explícitos).
5. **Control de conflictos de horarios**: No puede haber dos reservas con `estado = 'confirmada'` para la misma `canchaId` cuyas fechas de uso se solapen con los horarios registrados.
6. **Inactivación lógica**: Si una cancha, horario o usuario deja de estar disponible, se marca con `activo = false` o `estado = false`; no se elimina físicamente.
7. **Validación temporal**: En `horarios`, `fechaFin` debe ser mayor que `fechaInicio`.
8. **Estado normalizado**: Los valores de `estado` en reservas deben ser uno de los enums definidos.
9. **Campos de auditoría**: Toda entidad tiene `created_at` y `updated_at` para trazabilidad.
10. **Integridad referencial**: Todas las FKs deben ser NOT NULL a menos que se especifique lo contrario.

## 5. Recomendación de mantenimiento

Para mantener consistencia con el proyecto, cada cambio en el modelo de datos debe reflejarse en:
- las entidades TypeORM,
- los DTOs,
- los servicios y validaciones,
- y la documentación del spec.

Esto evita que el modelo conceptual y el modelo implementado diverjan.