# Spec 8: Gestión de estado de reservas

## Objetivo
Permitir al administrador confirmar pago, confirmar, finalizar o cancelar reservas siguiendo el flujo de estados permitido.

## Contexto
El administrador controla el ciclo de vida de la reserva para garantizar que solo reservas válidas se ejecuten hasta finalizar.

## Entradas / Salidas
- Entradas:
  - ID de reserva
  - Acción de estado: confirmar pago, confirmar, finalizar, cancelar
- Salidas:
  - Reserva actualizada con nuevo estado
  - Mensaje de resultado o error

## Reglas
- RN-08: El administrador confirma manualmente el pago y cambia el estado a Confirmada.
- RN-09: Flujo permitido:
  - Pendiente → Confirmada → Finalizada
  - Pendiente → Cancelada
  - Confirmada → Cancelada
- No permitir transiciones de estado inválidas.
- Cancelar reserva libera el horario.
- Finalizar reserva solo si está Confirmada.

## Criterios de aceptación
- El administrador puede cambiar una reserva de Pendiente a Confirmada.
- El administrador puede finalizar una reserva Confirmada.
- El administrador puede cancelar reservas Pendientes o Confirmadas.
- El sistema rechaza transiciones de estado no permitidas.
- El estado actualizado se refleja correctamente en las consultas.

## Fuera de alcance
- Reglas de reembolso o cargos.
- Estados intermedios de pago de pasarela.
