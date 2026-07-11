# Spec 1: Autenticación de clientes

## Objetivo
Permitir que un cliente se registre e inicie sesión en la plataforma para poder reservar canchas.

## Contexto
El cliente necesita una cuenta válida antes de acceder a las funcionalidades de reserva y su historial. Solo usuarios autenticados pueden crear reservas y consultar sus propias reservas.

## Entradas / Salidas
- Entradas:
  - Nombre
  - Correo electrónico
  - Contraseña
  - Datos de perfil opcionales
- Salidas:
  - Confirmación de registro
  - Token o sesión de acceso
  - Mensajes de error en caso de datos inválidos o correo ya existente

## Reglas
- RN-01: El cliente debe estar registrado para reservar.
- Validar correo electrónico con formato correcto.
- Validar que la contraseña cumple los requisitos de seguridad.
- No permitir registro de administrador desde la interfaz de cliente.
- No permitir registro con correo duplicado.

## Criterios de aceptación
- El cliente puede registrarse con datos válidos.
- El sistema rechaza un registro con correo duplicado.
- El cliente puede iniciar sesión con credenciales válidas.
- El sistema devuelve un token/sesión válida tras el login.
- El cliente autenticado puede acceder a rutas protegidas de cliente.
- El cliente no puede acceder a rutas administrativas.

## Fuera de alcance
- Recuperación de contraseña.
- Verificación de correo electrónico.
- Integración con OAuth o login social.
