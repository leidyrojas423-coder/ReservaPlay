# Spec 12: Reglas de Negocio

Este documento define las reglas de negocio lógicas que rigen el funcionamiento del sistema **ReservaPlay**. Estas reglas controlan la lógica de reservas, cancelaciones, tarifas y permisos de usuario.

---

## 1. Reglas de Gestión de Reservas

### 1.1. Disponibilidad Temporal y Solapamiento
- **Regla:** Una cancha deportiva no puede ser reservada por más de un cliente para la misma fecha y el mismo bloque horario.
- **Validación del Sistema:** El sistema debe comprobar la existencia de una reserva activa (estado `confirmada` o `pendiente`) antes de consolidar una nueva solicitud de reserva. Si ya existe, se lanzará una excepción `409 Conflict`.

### 1.2. Límite de Reservas Activas por Cliente
- **Regla:** Un cliente regular no puede tener más de **3 reservas activas** de forma simultánea en estado `pendiente`.
- **Objetivo:** Evitar el acaparamiento de bloques horarios que impida el uso común de las instalaciones.

---

## 2. Reglas de Cancelación y Reembolsos

### 2.1. Ventana de Cancelación
- **Regla:** Un cliente puede cancelar su reserva de forma autónoma hasta **24 horas antes** del inicio programado del bloque de juego.
- **Acción:** Si se realiza dentro del plazo permitido, el estado de la reserva cambia a `cancelada` y se emite un comprobante de crédito/devolución (si aplica).
- **Restricción:** Si quedan menos de 24 horas para el juego, el botón de cancelación estará deshabilitado para el cliente en la plataforma. Solo un administrador del sistema podrá procesar la cancelación en casos excepcionales.

---

## 3. Políticas de Tarifas y Horarios

### 3.1. Tarifas Diferenciales (Opcional)
- **Regla:** El precio base de la cancha se define por hora en la tabla `canchas`. Sin embargo, el administrador puede definir recargos en los horarios de "alta demanda" (por ejemplo, bloques nocturnos entre las 18:00 y las 22:00 horas).

### 3.2. Bloqueo de Mantenimiento
- **Regla:** El administrador puede deshabilitar canchas o bloques de horarios por mantenimiento. Ningún cliente podrá realizar reservas en bloques inactivos.

---

## 4. Matriz de Permisos y Roles

| Acción | Rol: Cliente | Rol: Administrador |
| :--- | :---: | :---: |
| Registrarse en el sistema | Sí | No (Cuentas internas) |
| Consultar disponibilidad de canchas | Sí | Sí |
| Crear una nueva reserva | Sí | Sí (En representación de un cliente) |
| Confirmar reservas pendientes | No | Sí |
| Cancelar reserva propia (>24h) | Sí | Sí |
| Cancelar reserva propia (<24h) | No | Sí |
| Crear, modificar o desactivar canchas | No | Sí |
| Gestionar bloques de horarios | No | Sí |