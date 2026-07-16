# Spec 3: Control de permisos y roles

## Objetivo
Garantizar que cada acción del sistema solo sea ejecutada por usuarios con el rol y los permisos adecuados.

## Contexto
El sistema define dos roles principales:
- Cliente: puede gestionar su propia información y sus reservas.
- Administrador: puede gestionar recursos del sistema como canchas, horarios y reservas.

El control de acceso debe aplicarse en la capa de autenticación/autorización de la API para evitar que un usuario con un rol menor acceda a operaciones sensibles.

## Entradas / Salidas
- Entradas:
  - Solicitud autenticada
  - Rol del usuario autenticado (cliente o administrador)
  - Recurso o acción solicitada
  - Identificador del recurso cuando aplique (por ejemplo, reserva o cancha)
- Salidas:
  - Permiso concedido o denegado
  - Código HTTP 403 Forbidden cuando el usuario no tiene autorización
  - Código HTTP 401 Unauthorized cuando no hay token o este es inválido
  - Mensaje claro de error de acceso no autorizado

## Reglas de negocio
- RN-12: Solo el administrador puede administrar canchas, horarios y reservas.
- RN-13: El cliente solo puede consultar y administrar sus propias reservas.
- RN-14: Un cliente no puede modificar ni eliminar recursos del sistema que no le pertenecen.
- RN-15: Un administrador puede ver y gestionar todas las reservas del sistema.
- RN-16: El sistema debe validar el rol antes de ejecutar cualquier acción sensible.

## Permisos por rol
### Cliente
Puede:
- registrarse e iniciar sesión
- consultar canchas
- consultar disponibilidad de canchas
- crear reservas
- ver sus reservas propias
- cancelar sus reservas pendientes

No puede:
- crear, editar o desactivar canchas
- configurar horarios
- cambiar el estado de reservas de otros usuarios
- acceder a rutas exclusivas del panel administrativo

### Administrador
Puede:
- iniciar sesión
- gestionar canchas
- gestionar horarios
- consultar todas las reservas
- confirmar pagos
- cambiar estados de reservas
- cambiar estados de canchas

No puede:
- utilizar permisos de cliente para modificar recursos ajenos a su rol administrativo

## Comportamiento esperado
- Si un cliente intenta acceder a una ruta administrativa, el sistema debe bloquear la solicitud con HTTP 403.
- Si un usuario no autenticado intenta acceder a una ruta protegida, el sistema debe responder con HTTP 401.
- Si un cliente intenta modificar una reserva que no le pertenece, el sistema debe rechazar la acción.
- Si un administrador intenta acceder a acciones reservadas al cliente, el sistema debe permitir el acceso solo si la ruta está explícitamente habilitada para su rol.
- Las rutas de ejemplo para validación son:
  - GET /auth/me: accesible para usuarios autenticados.
  - GET /auth/admin/dashboard: accesible solo para administradores.
  - GET /users/admin: accesible solo para administradores.

## Criterios de aceptación
- Un cliente autenticado no puede acceder a operaciones administrativas.
- Un administrador autenticado puede acceder a gestión de canchas, horarios y reservas.
- Un cliente solo puede operar sobre sus propias reservas.
- El sistema devuelve 403 cuando un usuario no tiene permisos suficientes.
- El sistema devuelve 401 cuando falta o es inválido el token de autenticación.
- La autorización se aplica antes de ejecutar la lógica de negocio.

## Fuera de alcance
- Permisos dinámicos o granulares por recurso más allá de los roles definidos.
- Configuración de permisos en tiempo de ejecución.
- Gestión de múltiples roles por usuario distintos a cliente y administrador.
