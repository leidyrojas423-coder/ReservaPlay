# Spec 12: Reglas de Negocio (Coherente con el proyecto actual)

Este documento define las reglas de negocio que deben regir el comportamiento del sistema **ReservaPlay** con base en la implementación real del backend. Debe mantenerse alineado con los servicios actuales de `canchas`, `horarios` y con el flujo que aún está pendiente en `reservas`.

> Nota de coherencia: el proyecto actual ya valida solapamiento de horarios, disponibilidad por fecha y estado de cancha, pero aún no ha implementado el módulo de reservas con su lógica completa. Por eso este spec debe distinguir entre reglas ya soportadas en código y reglas pendientes de desarrollo.

---

## 1. Reglas de gestión de disponibilidad

### 1.1. Solapamiento de horarios por cancha
- **Regla:** Dos horarios activos no pueden solaparse en la misma cancha.
- **Validación actual en el sistema:** el servicio de horarios valida el rango de fechas y rechaza solapamientos con `ConflictException`.
- **Resultado esperado:** si el rango nuevo intersecta con otro horario activo de la misma cancha, se debe responder con un error `409 Conflict`.

### 1.2. Disponibilidad por fecha y horario
- **Regla:** Una cancha solo se considera disponible si está activa (`activo = true`) y su estado principal es `Disponible`.
- **Validación actual en el sistema:** `CanchasService.consultarDisponibilidad()` filtra por `activo = true`, `estado = 'Disponible'`, y luego excluye los horarios que ya tienen una reserva activa asociada.
- **Resultado esperado:** el sistema debe devolver solo los bloques horarios que no presenten conflicto con reservas activas.

### 1.3. Bloqueo por mantenimiento
- **Regla:** El administrador puede desactivar una cancha o un horario para mantenimiento. En ese estado, no debe estar disponible para nuevas reservas.
- **Validación actual en el sistema:** `deactivate()` en canchas marca la entidad como `activo = false` y ajusta su estado a `Mantenimiento`.

---

## 2. Reglas de reservas

### 2.1. Reserva activa y conflicto temporal
- **Regla:** No se puede generar una nueva reserva si el mismo `horarioId` ya está ocupado por una reserva activa en la fecha consultada.
- **Estado de implementación:** esta lógica se aplica de forma indirecta en la disponibilidad, pero el módulo `reservas` aún no está implementado completamente.
- **Resultado esperado:** en el flujo final de reservas, un conflicto debe responder con `409 Conflict`.

### 2.2. Límite de reservas por cliente
- **Regla objetivo:** un cliente no debería tener más de 3 reservas activas concurrentes.
- **Estado de implementación:** esta regla aún no está codificada en la capa actual; se recomienda dejarla como requisito pendiente de validación en `ReservasService`.

### 2.3. Estados de reserva
- **Regla:** los estados de la reserva deben mantenerse en un conjunto controlado.
- **Estados esperados:** `pendiente`, `confirmada`, `cancelada`, `rechazada`, `completada` o `finalizada`.
- **Estado actual en código:** el servicio de canchas usa una lista de estados no activos para considerar la reserva como no vigente.

---

## 3. Reglas de cancelación y mantenimiento

### 3.1. Ventana de cancelación
- **Regla objetivo:** un cliente puede cancelar una reserva hasta 24 horas antes de la fecha/hora de inicio del bloque.
- **Estado de implementación:** esta regla no está implementada aún porque el servicio de reservas está vacío.
- **Recomendación:** documentarla como requisito a implementar en el flujo de reservas con validación de tiempo real.

### 3.2. Cancelación administrativa
- **Regla objetivo:** un administrador puede cancelar reservas en casos excepcionales, incluso si el cliente ya no puede hacerlo por la ventana de tiempo.
- **Estado de implementación:** pendiente.

---

## 4. Políticas de tarifas y horarios

### 4.1. Precio base de cancha
- **Regla:** la tarifa base de la cancha se toma del campo `precio` en la entidad `canchas`.
- **Estado actual:** el proyecto usa este precio como dato base, pero no implementa recargos por demanda en la lógica actual.

### 4.2. Horarios de alta demanda
- **Regla objetivo:** el sistema podría admitir recargos diferenciales por horarios de alta demanda.
- **Estado actual:** no existe implementación en el backend. Se recomienda mantenerlo como extensión futura y no como regla vigente del sistema.

---

## 5. Matriz de permisos y roles

| Acción | Rol: `client` | Rol: `admin` |
| :--- | :---: | :---: |
| Registrarse en el sistema | Sí | No (cuentas internas) |
| Consultar disponibilidad de canchas | Sí | Sí |
| Crear un horario | No | Sí |
| Actualizar o desactivar un horario | No | Sí |
| Crear o modificar canchas | No | Sí |
| Desactivar canchas | No | Sí |
| Ver perfil propio | Sí | Sí |
| Acceder a dashboard administrativo | No | Sí |
| Gestionar reservas | Pendiente | Pendiente |

---

## 6. Reglas de coherencia con el proyecto

1. El spec debe reflejar primero lo que ya está implementado en `canchas` y `horarios`.
2. Las reglas de `reservas` deben marcarse como pendientes si aún no existen en el controlador o servicio correspondiente.
3. Los roles deben usarse con la nomenclatura real del proyecto: `client` y `admin`.
4. La validación de horarios no debe inventar comportamientos que no estén presentes en la lógica actual del servicio.
5. Cada nueva regla de negocio debe actualizar también los servicios, DTOs y controladores para mantener trazabilidad con el código.
