# Spec 7: Creación de reservas

## Objetivo
Permitir al cliente crear una reserva sobre un horario disponible y garantizar que la reserva inicia en estado Pendiente.

## Contexto
La reserva vincula cliente, horario y cancha. Solo puede crearse si el horario está libre y la cancha no está en mantenimiento.

## Entradas / Salidas
- Entradas:
  - Cliente autenticado
  - ID de horario seleccionado
  - Datos opcionales de reserva
- Salidas:
  - Reserva creada en estado Pendiente
  - Detalle de la reserva
  - Mensaje de error si no es posible reservar

## Reglas
- RN-01: Solo clientes registrados pueden reservar.
- RN-06: Cada horario admite como máximo una reserva activa.
- RN-07: Toda reserva inicia en estado Pendiente.
- RN-10: No se permiten reservas en canchas en mantenimiento ni sobre horarios ocupados.
- RN-13: El cliente solo puede administrar sus propias reservas.

## Criterios de aceptación
- El cliente puede reservar un horario disponible.
- La reserva se crea en estado Pendiente.
- No se permite crear más de una reserva sobre el mismo horario.
- Si la cancha está en mantenimiento, el intento de reserva falla.
- El cliente visualiza la reserva en su historial.

## Fuera de alcance
- Pasarela de pagos en línea.
- Pago automático.
- Reservas de invitados sin cuenta.
