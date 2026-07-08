# Spec 2: Autenticación de administradores

## Objetivo
Permitir que un administrador inicie sesión y acceda al panel de gestión de canchas, horarios y reservas.

## Contexto
El administrador gestiona recursos críticos del sistema y debe autenticarse para usar funciones administrativas.

## Entradas / Salidas
- Entradas:
  - Usuario o correo electrónico
  - Contraseña
- Salidas:
  - Token o sesión de acceso
  - Mensaje de error en caso de credenciales inválidas

## Reglas
- Solo administradores registrados pueden acceder al panel de administración.
- Mantener roles separados entre cliente y administrador.
- RN-12: Solo el administrador puede administrar canchas, horarios y reservas.

## Criterios de aceptación
- El administrador puede iniciar sesión con credenciales válidas.
- El sistema niega el acceso con credenciales inválidas.
- El administrador autenticado puede acceder a rutas y acciones de admin.
- Un cliente autenticado no puede acceder al panel administrativo.

## Fuera de alcance
- Registro de administradores desde interfaz pública.
- Gestión de roles más allá de cliente y administrador.
