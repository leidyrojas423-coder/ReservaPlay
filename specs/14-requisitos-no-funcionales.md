# Spec 14: Requisitos No Funcionales

Los requisitos no funcionales definen los atributos de calidad, rendimiento y restricciones técnicas que debe cumplir el sistema **ReservaPlay**.

---

## 1. Seguridad y Privacidad (RNF-S)
- **RNF-S1 (Encriptación de Datos):** Las contraseñas de todos los usuarios almacenadas en la base de datos PostgreSQL deben estar encriptadas utilizando un algoritmo hash robusto (ej. **bcrypt** con factor de costo 10).
- **RNF-S2 (Protección de Endpoints):** El intercambio de información sensible en producción debe realizarse mediante protocolos seguros HTTPS. Todas las peticiones al API (con excepción de `/auth/login`, registro de usuarios, y consulta pública de canchas/disponibilidad) deben autenticarse mediante Tokens Web JSON (JWT) transmitidos en las cabeceras HTTP.

## 2. Rendimiento y Escalabilidad (RNF-R)
- **RNF-R1 (Tiempo de Respuesta):** Los endpoints de consulta de disponibilidad de canchas y creación de reservas deben procesarse y responder en un tiempo menor a **1.5 segundos** en condiciones normales de tráfico.
- **RNF-R2 (Concurrencia):** El motor de reservas debe ser capaz de procesar transacciones concurrentes evitando colisiones o sobre-reservas en una misma cancha y horario.

## 3. Usabilidad y Accesibilidad (RNF-U)
- **RNF-U1 (Diseño Adaptativo / Responsive):** Las vistas del frontend deben ser 100% responsivas, permitiendo un uso cómodo desde dispositivos móviles (smartphones) y ordenadores de escritorio.
- **RNF-U2 (Retroalimentación Visual):** El sistema debe proveer mensajes claros e inmediatos ante fallos de red, denegación de permisos o éxito en el agendamiento.

## 4. Portabilidad y Disponibilidad (RNF-D)
- **RNF-D1 (Base de Datos Relacional):** El almacenamiento de persistencia debe utilizar estrictamente PostgreSQL versión 14 o superior.
- **RNF-D2 (Disponibilidad):** La aplicación backend debe ser diseñada sin estado (stateless) para facilitar su despliegue y escalabilidad en la nube (como Render, Fly.io, AWS o Docker).