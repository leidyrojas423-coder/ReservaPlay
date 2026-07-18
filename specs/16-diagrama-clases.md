# Spec 16: Diagrama de Clases

Este documento describe la estructura de clases del backend en coherencia con la implementación actual de NestJS + TypeORM.

> Nota de coherencia: el proyecto ya tiene entidades definidas en el código y módulos separados por dominio. El objetivo de este spec es reflejar esos modelos reales y no una propuesta conceptual que todavía no existe en el repo.

---

## 1. Entidades reales del proyecto

### 1.1 `User`
Archivo: `src/users/user.entity.ts`

```ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ length: 100 }) name!: string;
  @Column({ length: 150, unique: true }) email!: string;
  @Column({ select: false }) password!: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT }) role!: UserRole;
  @Column({ type: 'text', nullable: true }) profile?: string;
  @Column({ default: true }) active!: boolean;
}
```

### 1.2 `ClienteEntity`
Archivo: `src/clientes/entities/cliente.entity.ts`

```ts
@Entity('clientes')
export class ClienteEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ length: 100 }) nombre!: string;
  @Column({ length: 100 }) apellido!: string;
  @Column({ length: 150, unique: true }) correo!: string;
  @Column({ length: 20 }) telefono!: string;
  @Column({ select: false }) password!: string;
  @Column({ default: true }) estado!: boolean;
  @CreateDateColumn({ name: 'fecha_registro' }) fechaRegistro!: Date;
}
```

### 1.3 `AdministradorEntity`
Archivo: `src/administradores/entities/administrador.entity.ts`

```ts
@Entity('administradores')
export class AdministradorEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ length: 100 }) nombre!: string;
  @Column({ length: 100 }) apellido!: string;
  @Column({ length: 150, unique: true }) correo!: string;
  @Column({ length: 20 }) telefono!: string;
  @Column({ select: false }) password!: string;
  @Column({ default: true }) estado!: boolean;
  @CreateDateColumn({ name: 'fecha_registro' }) fechaRegistro!: Date;
}
```

### 1.4 `CanchaEntity`
Archivo: `src/canchas/entities/cancha.entity.ts`

```ts
@Entity('canchas')
export class CanchaEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ length: 100 }) nombre!: string;
  @Column({ length: 250, nullable: true }) descripcion?: string;
  @Column({ length: 100 }) ubicacion!: string;
  @Column({ length: 50, default: 'Disponible' }) estado!: string;
  @Column({ type: 'int', nullable: true }) capacidad?: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) precio?: number;
  @Column({ default: true }) activo!: boolean;
  @Column({ type: 'uuid' }) administradorId!: string;
  @ManyToOne(() => AdministradorEntity, { nullable: true, onDelete: 'SET NULL' }) administrador?: AdministradorEntity;
  @CreateDateColumn({ name: 'fecha_registro' }) fechaRegistro!: Date;
}
```

### 1.5 `HorarioEntity`
Archivo: `src/horarios/entities/horario.entity.ts`

```ts
@Entity('horarios')
export class HorarioEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ length: 100 }) nombre!: string;
  @Column({ length: 200, nullable: true }) descripcion?: string;
  @Column({ type: 'timestamp with time zone' }) fechaInicio!: Date;
  @Column({ type: 'timestamp with time zone' }) fechaFin!: Date;
  @Column({ default: true }) activo!: boolean;
  @Column({ type: 'uuid', nullable: true }) canchaId?: string;
  @ManyToOne(() => CanchaEntity, { nullable: true, onDelete: 'SET NULL' }) cancha?: CanchaEntity;
  @OneToMany(() => ReservaEntity, (reserva) => reserva.horario, { cascade: true }) reservas?: ReservaEntity[];
  @CreateDateColumn({ name: 'fecha_registro' }) fechaRegistro!: Date;
}
```

### 1.6 `ReservaEntity`
Archivo: `src/reservas/entities/reserva.entity.ts`

```ts
@Entity('reservas')
export class ReservaEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ length: 100 }) clienteId!: string;
  @Column({ length: 100 }) canchaId!: string;
  @Column({ type: 'uuid', nullable: true }) horarioId?: string;
  @Column({ type: 'timestamp' }) fechaReserva!: Date;
  @Column({ length: 50 }) estado!: string;
  @ManyToOne(() => HorarioEntity, (horario) => horario.reservas, { nullable: true, onDelete: 'SET NULL' }) horario?: HorarioEntity;
  @CreateDateColumn({ name: 'fecha_registro' }) fechaRegistro!: Date;
}
```

---

## 2. Relación entre módulos y entidades

```text
AppModule
  ├─ AuthModule
  ├─ ClientesModule
  ├─ AdministradoresModule
  ├─ CanchasModule
  ├─ HorariosModule
  └─ ReservasModule
```

### Relaciones observables en el código
- `CanchaEntity` tiene relación muchos-a-uno con `AdministradorEntity`.
- `HorarioEntity` tiene relación muchos-a-uno con `CanchaEntity`.
- `HorarioEntity` tiene relación uno-a-muchos con `ReservaEntity`.
- `ReservaEntity` asocia una reserva con un `HorarioEntity` por `horarioId`.
- `User` actúa como perfil base de autenticación, mientras que `ClienteEntity` y `AdministradorEntity` representan perfiles del dominio.

---

## 3. Diagrama de clases conceptual

```text
User
  ├─ role: client | admin
  └─ active: boolean

ClienteEntity
  ├─ nombre
  ├─ apellido
  ├─ correo
  ├─ telefono
  └─ estado

AdministradorEntity
  ├─ nombre
  ├─ apellido
  ├─ correo
  ├─ telefono
  └─ estado

CanchaEntity
  ├─ nombre
  ├─ ubicacion
  ├─ estado
  ├─ capacidad
  ├─ precio
  ├─ activo
  └─ administradorId

HorarioEntity
  ├─ nombre
  ├─ fechaInicio
  ├─ fechaFin
  ├─ activo
  └─ canchaId

ReservaEntity
  ├─ clienteId
  ├─ canchaId
  ├─ horarioId
  ├─ fechaReserva
  └─ estado
```

---

## 4. Estado de implementación

### Implementado
- autenticación con `User`.
- gestión de clientes.
- gestión de administradores.
- gestión de canchas.
- gestión de horarios.
- mapeo de relaciones entre canchas, horarios y reservas.

### Pendiente
- flujo completo de reservas con validación real de disponibilidad y cancelación.
- integración completa del modelo de `ClienteEntity` con el `User` de autenticación, si se quiere un diseño de perfil unificado.

---

## 5. Recomendaciones de coherencia

1. El diagrama de clases debe mantener correspondencia con los archivos dentro de `src/entities` y `src/*/entities`.
2. Cuando el backend define un `User` para auth, el spec debe describir claramente su rol en la arquitectura y no asumir una relación 1:1 no implementada.
3. Los módulos de reservas deben mantenerse como trabajo en curso si aún no exponen el flujo principal de negocio.
4. Cualquier cambio en entidades o relaciones debe reflejarse aquí para evitar divergencia entre arquitectura y documentación.