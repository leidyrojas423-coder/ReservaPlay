
# ReservaPlay

Repositorio de especificaciones y requisitos para el proyecto ReservaPlay.

## Estructura del proyecto

- `specs/`: especificaciones por funcionalidad.
- `ReservaPlay_Requisitos_Consolidados_v2.md`: documento consolidado de requisitos.

## Estado

Repositorio inicializado localmente con Git.

## Qué datos se persisten?

En **ReservaPlay** se almacenarán, entre otros:

- Clientes.
- Administradores.
- Canchas sintéticas.
- Horarios.
- Reservas.
- Estados de las reservas.
- Estado de las canchas.
- Historial de cambios (si se implementa).

Cada capa tiene una responsabilidad:

- **Controller:** recibe las solicitudes HTTP.
- **Service:** aplica la lógica de negocio.
- **Repository:** interactúa con la base de datos.
- **PostgreSQL:** almacena la información de forma permanente.

# Bloque 1. El problema de la memoria

## Objetivo

Comprender por qué no es suficiente almacenar la información en variables durante la ejecución del programa.

### ¿Qué ocurre?

Cuando una aplicación inicia, toda la información se guarda temporalmente en la memoria RAM.

Ejemplo:

```ts
const reserva = { cliente: "Juan", cancha: 1, hora: "18:00" };
```

Mientras la aplicación está ejecutándose, la información existe.

Pero si el servidor se reinicia:

- la variable desaparece;
- la reserva se pierde;
- el sistema queda sin información.

Este es el **problema de la memoria**.

# Bloque 2. La despensa que nunca olvida

## Objetivo

Introducir el concepto de **persistencia de datos**.

La solución al problema anterior es almacenar la información en una base de datos.

En lugar de guardar los datos únicamente en memoria:

Aplicación

↓

RAM

↓

Se pierde

se almacenan en PostgreSQL:

Aplicación

↓

PostgreSQL

↓

Permanece almacenado

Aplicación

↓

PostgreSQL

↓

Permanece almacenado

En **ReservaPlay**, se persistirán:

- Clientes.
- Administradores.
- Canchas.
- Horarios.
- Reservas.

# Bloque 3. Conectar la despensa

## Objetivo

Conectar el backend con la base de datos.

En NestJS esto implica:

- configurar PostgreSQL;
- establecer la conexión;
- crear las entidades;
- utilizar un ORM (como TypeORM o Prisma);
- realizar consultas desde los servicios.

El flujo es:
Cliente

↓

Controller

↓

Service

↓

Repository

↓

PostgreSQL

En este punto la aplicación ya puede leer y escribir datos en la base de datos.

# Bloque 4. Completar el CRUD (PUT · DELETE)

## Objetivo

Finalizar las cuatro operaciones básicas sobre los datos persistentes.

CRUD significa:

| Operación | Método HTTP | SQL |
| --------- | ----------- | ------ |
| Create    | POST        | INSERT |
| Read      | GET         | SELECT |
| Update    | PUT o PATCH | UPDATE |
| Delete    | DELETE      | DELETE |

### PUT

Actualizar información existente.

Ejemplo en ReservaPlay:

- cambiar el estado de una reserva;
- modificar los datos de una cancha;
- actualizar un horario.

### DELETE

Eliminar información.

Ejemplos:

- eliminar un horario;
- eliminar una cancha (si las reglas del negocio lo permiten);
- cancelar una reserva mediante una operación lógica o física, según el diseño del sistema.

# Bloque 5. El círculo se cierra

## Objetivo

Integrar todos los conceptos aprendidos.

Al finalizar este bloque, el sistema debe ser capaz de:

1. recibir solicitudes desde el frontend;
2. procesarlas en el backend;
3. almacenarlas en PostgreSQL;
4. consultarlas cuando sea necesario;
5. modificarlas;
6. eliminarlas.

El ciclo completo queda representado así:

```text
Usuario

↓

Frontend

↓

API REST (NestJS)

↓

Lógica de negocio

↓

Base de datos PostgreSQL

↓

Respuesta al usuario
```

---

# Aplicación al proyecto ReservaPlay

Estos cinco bloques se traducen directamente al desarrollo de tu sistema:

- **El problema de la memoria:** Entender que las reservas no pueden almacenarse solo en variables temporales.
- **La despensa que nunca olvida:** Persistir clientes, administradores, canchas, horarios y reservas en PostgreSQL.
- **Conectar la despensa:** Configurar la conexión entre NestJS y PostgreSQL mediante un ORM.
- **Completar el CRUD:** Implementar los endpoints para crear, consultar, actualizar y eliminar entidades del sistema.
- **El círculo se cierra:** Lograr un flujo completo donde el usuario interactúe con el frontend, el backend procese las solicitudes y la base de datos garantice la persistencia de la información.

# Avance de specs y frontend
- Se levantaron los servidores del backend y frontend
- Vinculación de los specs de diseño técnico con el código real del frontend
- Actualización de la página de inicio (page.tsx) con la nueva portada deportiva y tipografía Bebas Neue
- Limpieza y orden de terminales locales para resolver conflictos de puertos (EADDRINUSE)
- Sincronización del servidor de desarrollo backend y frontend en localhost:3001
- Mapeo y estructuración de los specs de Gestión de Canchas, Gestión de Horarios y Autenticación de Administradores

