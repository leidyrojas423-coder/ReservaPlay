# Spec 5: Gestión de horarios

## Objetivo
Permitir al administrador configurar los horarios de reserva de cada cancha sin solapamientos.

## Contexto
Cada cancha puede tener múltiples horarios que definen cuándo se puede reservar. La gestión de horarios es clave para evitar conflictos.

## Entradas / Salidas
- Entradas:
  - Cancha asociada
  - Fecha y hora de inicio
  - Fecha y hora de fin
  - Estado del horario (activo/inactivo)
- Salidas:
  - Horario creado o actualizado
  - Lista de horarios por cancha
  - Mensaje de error si hay solapamiento o datos inválidos

## Reglas
- RN-04 y RN-05: Cada cancha puede tener múltiples horarios y cada horario pertenece a una única cancha.
- RN-11: No se permiten horarios solapados para una misma cancha.
- RN-06: Cada horario admite como máximo una reserva activa.
- No se permiten horarios en fechas pasadas.

## Criterios de aceptación
- El administrador puede crear horarios válidos.
- El sistema rechaza horarios solapados en la misma cancha.
- El administrador puede editar horarios existentes.
- No se pueden eliminar horarios con reservas activas sin una restricción clara.
- Horarios inactivos no se muestran como disponibles.

## Fuera de alcance
- Horarios recurrentes complejos.
- Generación automática de horarios por plantillas o reglas avanzadas.
