# Spec 13: Requisitos Funcionales

Este documento describe los requerimientos funcionales del sistema **ReservaPlay**, detallando los casos de uso principales que el software debe resolver.

---

## RF-01: Autenticación y Registro de Usuarios
- **RF-01.1:** El sistema debe permitir a los clientes registrarse suministrando su nombre completo, correo electrónico, contraseña y un número de teléfono válido.
- **RF-01.2:** El sistema debe permitir el inicio de sesión seguro a través de credenciales encriptadas, retornando un token de sesión (JWT).
- **RF-01.3:** El sistema debe restringir el acceso a las vistas de administración únicamente a los usuarios con el rol de `Administrador`.

## RF-02: Gestión de Escenarios Deportivos (Canchas)
- **RF-02.1:** El sistema debe permitir a los administradores registrar nuevas canchas (indicando nombre, tipo de deporte, precio por hora y foto opcional).
- **RF-02.2:** El administrador debe poder modificar la información de una cancha existente.
- **RF-02.3:** El administrador debe poder activar o desactivar canchas de manera lógica para habilitar o suspender su alquiler.

## RF-03: Gestión de Disponibilidad y Horarios
- **RF-03.1:** El administrador debe poder programar los bloques de horario de operación para cada cancha.
- **RF-03.2:** El sistema debe mostrar en tiempo real a los clientes los horarios disponibles y ocupados de una cancha seleccionada para una fecha específica.

## RF-04: Motor de Reservas
- **RF-04.1:** Los clientes autenticados deben poder seleccionar una cancha, un día y un horario disponible para agendar su juego.
- **RF-04.2:** El sistema debe calcular de manera automática el total a pagar basándose en la tarifa de la cancha elegida.
- **RF-04.3:** El sistema debe registrar las reservas con el estado inicial `pendiente` o `confirmada` según corresponda.

## RF-05: Historial y Cancelación de Reservas
- **RF-05.1:** Los clientes deben tener acceso a un panel de control con el historial de sus reservas pasadas y activas.
- **RF-05.2:** El cliente debe poder cancelar una reserva directamente desde su panel, siempre y cuando se cumpla la ventana temporal de anticipación (mínimo 24 horas).