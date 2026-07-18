# Spec 15: Casos de Uso del Sistema

Este documento define la interacción de los diferentes actores (Clientes y Administradores) con el sistema **ReservaPlay**.

---

## 1. Diagrama de Casos de Uso (Estructura)

### Actores:
- **Cliente:** Persona interesada en alquilar canchas y gestionar sus reservas.
- **Administrador:** Encargado de controlar los parámetros del sistema (canchas, horarios y estados).

---

## 2. Detalle de los Casos de Uso Principales

### CU-01: Reservar Cancha Deportiva
- **Actor Principal:** Cliente
- **Precondiciones:** El cliente debe haber iniciado sesión en la plataforma. Debe existir al menos una cancha activa con horarios disponibles.
- **Flujo Principal:**
  1. El cliente accede a la vista de "Consulta de Disponibilidad".
  2. Selecciona la cancha de su preferencia y una fecha del calendario.
  3. El sistema despliega los bloques horarios de esa fecha indicando cuáles están libres.
  4. El cliente selecciona un bloque libre y confirma la solicitud.
  5. El sistema procesa la reserva, asignándole el estado `pendiente` y restando la disponibilidad de ese bloque para esa fecha.
  6. El sistema muestra un mensaje de éxito con el resumen de su reserva.
- **Flujo Alterno (Horario Ocupado):**
  - Si en el paso 4, otro cliente confirma el bloque milisegundos antes, el sistema rechaza la transacción y alerta al usuario para que seleccione otra hora.

### CU-02: Cancelación de Reserva
- **Actor Principal:** Cliente / Administrador
- **Precondiciones:** Debe existir una reserva activa.
- **Flujo Principal (Cliente):**
  1. El cliente entra a su "Historial de Reservas".
  2. Selecciona una reserva que está programada para más de 24 horas en el futuro.
  3. Presiona el botón "Cancelar Reserva".
  4. El sistema actualiza el estado a `cancelada` y libera el bloque para que otros usuarios puedan reservarlo.
- **Flujo Alterno (Menos de 24 horas):**
  - Si faltan menos de 24 horas, el sistema bloquea la acción para el cliente. El cliente debe contactar al administrador para que este la cancele manualmente.

### CU-03: Crear Cancha y Configurar Horarios
- **Actor Principal:** Administrador
- **Precondiciones:** El usuario autenticado debe poseer el rol `administrador`.
- **Flujo Principal:**
  1. El administrador ingresa a la vista de "Configuración de Canchas".
  2. Completa el formulario de creación de canchas (Nombre, tipo, costo) y la guarda.
  3. Al guardarse, el sistema lo redirige a la sección de "Bloques de Horario" de esa cancha.
  4. El administrador selecciona los días de la semana y los rangos de hora hábiles (ej. Lunes a Viernes de 18:00 a 22:00) y los registra.
  5. El sistema confirma la creación de los horarios.