
# Spec 4: Gestión de canchas

## Objetivo
Permitir al administrador crear, editar, desactivar y cambiar el estado de las canchas.

## Contexto
Las canchas son el recurso central de la plataforma y solo deben estar disponibles para reserva cuando correspondan.

## Entradas / Salidas
- Entradas:
  - Nombre de cancha
  - Descripción
  - Ubicación
  - Estado inicial (Disponible, Ocupada, Mantenimiento)
  - Datos opcionales de capacidad y precio
- Salidas:
  - Cancha creada o actualizada
  - Lista de canchas
  - Mensaje de éxito o error

## Reglas
- RN-03: Cada cancha pertenece a un administrador.
- La cancha puede tener estados: Disponible, Ocupada o Mantenimiento.
- RN-10: No se permiten reservas en canchas en mantenimiento.
- Desactivar una cancha la excluye de la consulta de disponibilidad.

## Criterios de aceptación
- El administrador puede crear una cancha nueva.
- El administrador puede editar los datos de una cancha.
- El administrador puede cambiar el estado de una cancha.
- Una cancha en mantenimiento o desactivada no aparece en la disponibilidad.
- Se conserva la relación de cancha con su administrador.

## Fuera de alcance
- Gestión de multimedia o fotos de la cancha.
- Integraciones externas para localización.
