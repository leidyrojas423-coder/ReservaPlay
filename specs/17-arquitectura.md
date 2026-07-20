# Spec 17: Arquitectura de Software

El sistema **ReservaPlay** está implementado como un backend en NestJS con arquitectura modular orientada a dominios. Esta especificación debe reflejar la estructura real del repositorio y no una propuesta de arquitectura distante de la implementación.

> Nota de coherencia: el proyecto ya usa `@nestjs/common`, `@nestjs/config`, `TypeOrmModule`, guards de autenticación y `passport-jwt`. Por tanto, el spec 17 debe describir la solución actual y no inventar un estilo arquitectónico ajeno al repo.

---

## 1. Estructura y estilo arquitectónico

La aplicación se compone principalmente de una capa de aplicación NestJS, una capa de acceso a datos con TypeORM y una capa de autenticación basada en JWT.

El patrón dominante en el repo es:
- `Controller`: recibe solicitudes HTTP.
- `Service`: encapsula la lógica de negocio.
- `Module`: agrupa dependencias y entidades.
- `Entity`: representa la persistencia en PostgreSQL.
- `Guard`: restringe accesos por roles.

---

## 2. Módulos principales del backend

### 2.1 `AppModule`
Archivo: `src/app.module.ts`

Responsabilidades:
- registra `ConfigModule` de forma global,
- configura `TypeOrmModule.forRootAsync()` con PostgreSQL,
- importa los módulos funcionales del sistema,
- registra globalmente `RolesGuard` a través de `APP_GUARD`.

### 2.2 `AuthModule`
Archivo: `src/auth/auth.module.ts`

Responsabilidades:
- expone endpoints de login y perfil autenticado,
- integra `PassportModule`, `JwtModule` y `UsersModule`,
- define el `JwtStrategy` para validar tokens JWT.

### 2.3 `UsersModule`
Archivo: `src/users/users.module.ts`

Responsabilidades:
- persiste `User` como entidad base para autenticación,
- exporta `UsersService` para que otros módulos lo utilicen.

### 2.4 `ClientesModule`
Archivo: `src/clientes/clientes.module.ts`

Responsabilidades:
- gestiona el registro y administración de clientes,
- usa `TypeOrmModule.forFeature([ClienteEntity])`.

### 2.5 `AdministradoresModule`
Archivo: `src/administradores/administradores.module.ts`

Responsabilidades:
- gestiona los perfiles administrativos,
- usa `TypeOrmModule.forFeature([AdministradorEntity])`.

### 2.6 `CanchasModule`
Archivo: `src/canchas/canchas.module.ts`

Responsabilidades:
- expone CRUD de canchas,
- expone endpoints de disponibilidad y consulta de canchas,
- conecta las entidades `CanchaEntity` y `AdministradorEntity`.

### 2.7 `HorariosModule`
Archivo: `src/horarios/horarios.module.ts`

Responsabilidades:
- gestiona horarios por cancha,
- conecta `HorarioEntity` con `CanchaEntity` y `ReservaEntity`.

### 2.8 `ReservasModule`
Archivo: `src/reservas/reservas.module.ts`

Responsabilidades actuales:
- está declarado como módulo funcional,
- pero su controller está vacío y su flujo principal de negocio aún no está implementado.

---

## 3. Patrones de seguridad y configuración

### 3.1 Autenticación
El backend protege rutas con `JwtAuthGuard` y restringe acceso por `Roles` mediante `RolesGuard`.

### 3.2 JWT
El módulo de autenticación configura:
- `JWT_SECRET` desde `ConfigService`, con fallback local,
- `JWT_EXPIRES_IN` desde variables de entorno.

### 3.3 Configuración externa
La aplicación centraliza la configuración mediante `ConfigModule.forRoot({ isGlobal: true })` y usa variables de entorno para la conexión a PostgreSQL.

---

## 4. Capa de persistencia

La infraestructura de persistencia usa TypeORM sobre PostgreSQL.

En `AppModule` el backend configura:
- `type: 'postgres'`
- host, puerto, usuario, password y database desde variables de entorno
- `entities: [__dirname + '/**/*.entity{.ts,.js}']`
- `synchronize: true` en el arranque actual

Esto implica que la base de datos es el almacenamiento central del sistema y que cada módulo mapea sus entidades a tablas relacionales.

---

## 5. Diagrama arquitectónico conceptual

```text
Cliente / Frontend
   ↓
API REST (NestJS)
   ├─ AuthModule
   ├─ UsersModule
   ├─ ClientesModule
   ├─ AdministradoresModule
   ├─ CanchasModule
   ├─ HorariosModule
   └─ ReservasModule
   ↓
TypeORM + PostgreSQL
```

---

## 6. Estado actual del módulo de reservas

El módulo `ReservasModule` ya existe en la arquitectura, pero su implementación todavía está incompleta:
- el `ReservasController` está definido pero sin endpoints concretos,
- el flujo de reserva no está expuesto como API real,
- la lógica de negocio de reservas sigue siendo un trabajo pendiente.

Por eso, la arquitectura del proyecto ya está modularizada, pero la funcionalidad de reservas aún no está cerrada.

---

## 7. Recomendaciones de coherencia

1. La arquitectura debe describir la estructura real del backend y no una topología idealizada.
2. Los módulos ya existentes deben reflejar los imports reales en `AppModule`.
3. El uso de JWT, guards y configuración ambiental debe quedar documentado como base de la seguridad actual.
4. El módulo de reservas debe mantenerse como pendiente hasta que el flujo completo quede implementado y documentado.