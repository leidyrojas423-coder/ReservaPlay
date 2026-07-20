# Spec 2: Autenticación de administradores

## Objetivo

Permitir que un administrador inicie sesión de forma segura para acceder al panel administrativo del sistema ReservaPlay, desde donde podrá gestionar canchas, horarios, reservas y usuarios según los permisos asignados.

---

## Alcance

Este caso de uso comprende el proceso de autenticación de administradores mediante credenciales válidas, la validación de permisos, la generación del token JWT y el acceso a las funcionalidades administrativas.

No contempla el registro público de administradores ni la recuperación de contraseña.

---

## Actores

- Administrador
- Sistema ReservaPlay

---

## Entradas

- Usuario o correo electrónico.
- Contraseña.

---

## Salidas

- Token JWT.
- Información básica del administrador autenticado.
- Mensaje de autenticación exitosa.
- Mensaje de error cuando las credenciales son incorrectas.

---

## Reglas de negocio

- Solo administradores registrados pueden autenticarse.
- La contraseña debe coincidir con la almacenada en la base de datos.
- El sistema debe generar un token JWT válido.
- El token debe enviarse en las peticiones protegidas.
- Los clientes no pueden acceder a rutas administrativas.
- RN-12: Solo el administrador puede administrar canchas, horarios y reservas.

---

## Flujo principal

1. El administrador accede al formulario de inicio de sesión.
2. Ingresa usuario o correo electrónico.
3. Ingresa la contraseña.
4. El sistema valida las credenciales.
5. El sistema verifica que el usuario tenga rol de administrador.
6. Se genera un token JWT.
7. El administrador accede al panel administrativo.

---

## Flujos alternativos

### Credenciales incorrectas

1. El usuario ingresa información incorrecta.
2. El sistema rechaza el inicio de sesión.
3. Se muestra un mensaje de credenciales inválidas.

### Usuario sin permisos

1. El usuario posee una cuenta válida.
2. No tiene rol de administrador.
3. El sistema bloquea el acceso al panel administrativo.

---

## Validaciones

- Usuario obligatorio.
- Contraseña obligatoria.
- Usuario existente.
- Contraseña correcta.
- Rol igual a administrador.
- Token JWT válido.

---

## Endpoints

| Método | Endpoint | Descripción |
|---------|----------|-------------|
| POST | /auth/admin/login | Inicio de sesión del administrador |
| GET | /auth/admin/dashboard | Acceso al panel administrativo |
| GET | /auth/me | Obtener información del usuario autenticado |

---

## DTO

### LoginAdminDto

```ts
{
  username: string;
  password: string;
}
```

---

## Respuestas HTTP

| Código | Descripción |
|---------|-------------|
| 200 | Inicio de sesión exitoso |
| 400 | Datos inválidos |
| 401 | Credenciales incorrectas |
| 403 | Usuario sin permisos |
| 500 | Error interno del servidor |

---

## Casos borde

- Usuario inexistente.
- Contraseña vacía.
- Usuario vacío.
- Token expirado.
- Token inválido.
- Cliente intentando acceder al panel administrativo.

---

## Criterios de aceptación

- El administrador puede iniciar sesión con credenciales válidas.
- Se genera un token JWT.
- El administrador accede al panel administrativo.
- El sistema rechaza credenciales inválidas.
- Un cliente autenticado no puede acceder al panel administrativo.
- El sistema protege las rutas administrativas mediante autenticación.

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
- AdministradoresModule.
- Base de datos PostgreSQL.