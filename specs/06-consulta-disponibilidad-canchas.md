# Spec 6: Consulta de disponibilidad de canchas

## Objetivo
Permitir a clientes y administradores consultar qué canchas y horarios están disponibles para reservar.

## Contexto
La disponibilidad se calcula a partir de canchas, horarios activos y reservas actuales. El sistema debe excluir recursos no disponibles.

## Entradas / Salidas
- Entradas:
  - Filtros opcionales: fecha, cancha, estado, rango horario
- Salidas:
  - Lista de canchas y horarios disponibles
  - Estado de la cancha
  - Mensaje cuando no hay disponibilidad

## Reglas
- Solo mostrar horarios activos.
- Excluir canchas en mantenimiento.
- Excluir horarios con reservas activas.
- Respetar la regla de que solo un horario puede tener una reserva activa.

## Criterios de aceptación
- El cliente puede ver horarios disponibles para reservar.
- No se muestran horarios ocupados ni canchas en mantenimiento.
- Los filtros devuelven resultados correctos.
- La consulta funciona para cliente y administrador.
- Los resultados reflejan cambios actuales tras crear o cancelar reservas.

## Fuera de alcance
- Búsquedas avanzadas tipo full text.
- Sugerencias automáticas de horario.
