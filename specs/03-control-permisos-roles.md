# Spec 3: Control de permisos y roles

## Objetivo
Garantizar que cada acción del sistema se ejecute solo por el rol autorizado.

## Contexto
El sistema define dos roles claros con permisos distintos: cliente y administrador. El acceso debe controlarse tanto en la API como en la interfaz.

## Entradas / Salidas
- Entradas:
  - Solicitud autenticada
  - Rol del usuario (cliente o administrador)
  - Acción solicitada
- Salidas:
  - Permiso concedido o denegado
  - Código HTTP 403 en caso de acceso no autorizado

## Reglas
- El cliente puede: registrarse, iniciar sesión, consultar canchas, buscar disponibilidad, crear reservas, ver sus reservas y cancelar sus reservas pendientes.
- El administrador puede: iniciar sesión, crear/editar/desactivar canchas, configurar horarios, consultar todas las reservas, confirmar pagos, cambiar estado de reservas y cambiar estado de canchas.
- RN-13: El cliente solo puede consultar y administrar sus propias reservas.
- RN-12: Solo el administrador puede administrar canchas, horarios y reservas.

## Criterios de aceptación
- Acciones de administrador quedan bloqueadas para clientes.
- Acciones de cliente quedan limitadas a las rutas públicas y de cliente.
- El cliente no puede editar canchas ni horarios.
- El cliente no puede cambiar estado de reservas ajenas.
- El administrador puede ver todas las reservas y gestionar estados.

## Fuera de alcance
- Permisos dinámicos o granularizados por recurso más allá de los roles definidos.
- Configuración de permisos en tiempo de ejecución.
