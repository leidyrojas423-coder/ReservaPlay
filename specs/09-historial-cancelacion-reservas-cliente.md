# Spec 9: Historial y cancelación de reservas por cliente

## Objetivo
Permitir al cliente ver su historial de reservas y cancelar reservas pendientes.

## Contexto
Los clientes necesitan consultar sus reservas pasadas y actuales, y poder cancelar las reservas que aún no han sido confirmadas o finalizadas.

## Entradas / Salidas
- Entradas:
  - Cliente autenticado
  - Solicitud de listado de reservas
  - Solicitud de cancelación de reserva propia
- Salidas:
  - Lista de reservas del cliente
  - Confirmación de cancelación
  - Mensaje de error si la cancelación no está permitida

## Reglas
- RN-02: Un cliente puede tener múltiples reservas.
- RN-13: El cliente solo puede consultar y gestionar sus propias reservas.
- Solo se permiten cancelar reservas en estado Pendiente.
- Reservas Confirmadas pueden requerir gestión de administrador para cancelar.

## Criterios de aceptación
- El cliente ve todas sus reservas.
- El cliente puede cancelar una reserva Pendiente.
- El cliente no puede cancelar reservas de otros usuarios.
- Tras cancelar, el horario se libera y vuelve a estar disponible.
- El historial muestra el estado actualizado.

## Fuera de alcance
- Cancelación de reservas finalizadas.
- Penalizaciones por cancelación.
- Notificaciones automáticas de cancelación.
