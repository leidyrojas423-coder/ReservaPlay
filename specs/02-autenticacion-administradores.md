# Spec 02: Autenticación de administradores

## Objetivo

Permitir que un administrador inicie sesión de forma segura en ReservaPlay y acceda al panel administrativo para gestionar clientes, canchas, horarios y reservas.

---

## Alcance

Este caso de uso incluye:

- Inicio de sesión de administradores con credenciales válidas.
- Validación del rol de administrador.
- Generación y uso de un token JWT para sesiones protegidas.
- Acceso al panel administrativo.
- Protección de rutas que permiten gestionar clientes, canchas, horarios y reservas.

No incluye registro público de administradores, recuperación de contraseña ni autenticación con redes sociales.

---

## Actores

- Administrador.
- Sistema ReservaPlay.

---

## Precondiciones

- El usuario debe existir en el sistema.
- El usuario debe estar registrado con rol de administrador.

---

## Entradas

- Correo electrónico o nombre de usuario.
- Contraseña.

---

## Salidas

- Token JWT de acceso.
- Información básica del administrador autenticado.
- Mensaje de éxito o error según el resultado del proceso.

---

## Reglas de negocio

- RN-01: Solo los usuarios registrados como administradores pueden autenticarse para el panel administrativo.
- RN-02: Las credenciales ingresadas deben coincidir con las almacenadas en la base de datos.
- RN-03: El sistema debe generar un token JWT válido para la sesión del administrador.
- RN-04: El token debe enviarse en las peticiones a rutas protegidas.
- RN-05: Los clientes autenticados no pueden acceder al panel administrativo.
- RN-06: Un administrador autenticad puede gestionar clientes, canchas, horarios y reservas.
- RN-07: El sistema debe bloquear el acceso cuando el token sea inválido o expirado.

---

## Flujo principal

1. El administrador accede al formulario de inicio de sesión.
2. Ingresa su correo electrónico o usuario y contraseña.
3. El sistema valida que las credenciales existan y sean correctas.
4. El sistema verifica que el usuario tenga rol de administrador.
5. Se genera un token JWT.
6. El sistema devuelve el token y la información del administrador.
7. El administrador accede al panel administrativo.
8. Desde allí puede gestionar clientes, canchas, horarios y reservas.

---

## Flujos alternativos

### Credenciales incorrectas

1. El usuario ingresa datos incorrectos.
2. El sistema rechaza el inicio de sesión.
3. Se devuelve un mensaje de credenciales inválidas.

### Usuario sin permisos

1. El usuario tiene una cuenta válida.
2. No posee rol de administrador.
3. El sistema niega el acceso al panel administrativo.

### Token inválido o expirado

1. El administrador intenta acceder a una ruta protegida con un token inválido o vencido.
2. El sistema rechaza la solicitud.
3. Se devuelve un error de autenticación o autorización.

---

## Validaciones

- Correo o usuario obligatorio.
- Contraseña obligatoria.
- Usuario existente.
- Contraseña correcta.
- Rol igual a administrador.
- Token JWT válido.

---

## Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /auth/admin/login | Inicio de sesión del administrador |
| GET | /auth/me | Obtener información del usuario autenticado |
| GET | /auth/admin/dashboard | Acceso al panel administrativo |

---

## DTO

### LoginAdminDto

```ts
{
  email: string;
  password: string;
}
```

---

## Respuestas HTTP

| Código | Descripción |
|--------|-------------|
| 200 | Inicio de sesión exitoso |
| 400 | Datos inválidos |
| 401 | Credenciales incorrectas |
| 403 | Usuario sin permisos o acceso denegado |
| 500 | Error interno del servidor |

---

## Casos borde

- Usuario inexistente.
- Contraseña vacía.
- Correo o usuario vacío.
- Token expirado.
- Token inválido.
- Cliente intentando acceder al panel administrativo.

---

## Criterios de aceptación

- Un administrador puede iniciar sesión con credenciales válidas.
- El sistema genera un token JWT válido.
- El administrador puede acceder al panel administrativo.
- El sistema rechaza credenciales inválidas.
- Un cliente autenticado no puede acceder al panel administrativo.
- Las rutas administrativas quedan protegidas mediante autenticación y autorización.
- El administrador autenticado puede gestionar clientes, canchas, horarios y reservas.

---

## Fuera del alcance

- Registro público de administradores.
- Recuperación de contraseña.
- Gestión de múltiples roles.
- Inicio de sesión mediante redes sociales.

---

## Dependencias

- AuthModule.
- Passport JWT.
- JwtModule.
- UsersModule.
- Base de datos.
- Guards y decoradores de roles para autorización.
