# Spec 14: Requisitos No Funcionales (Coherente con el proyecto actual)

Los requisitos no funcionales definen los atributos de calidad, rendimiento y restricciones técnicas que debe cumplir el sistema **ReservaPlay**. Este documento debe mantenerse alineado con la infraestructura y la implementación actual del backend en NestJS.

> Nota de coherencia: el proyecto ya usa `bcrypt` para almacenamiento de contraseñas, `JWT` para autenticación, `passport-jwt` para extracción del token y PostgreSQL como motor principal. Por tanto, los requisitos no funcionales deben reflejar esas decisiones ya presentes en el código y no introducir supuestos ajenos al stack actual.

---

## 1. Seguridad y privacidad (RNF-S)
- **RNF-S1 (Encriptación de datos):** Las contraseñas de usuarios y perfiles deben almacenarse con hash seguro mediante `bcrypt`.
- **RNF-S2 (Protección de endpoints):** El acceso a endpoints protegidos debe hacerse mediante `JWT` enviado en la cabecera `Authorization: Bearer <token>`.
- **RNF-S3 (Autorización por roles):** El backend debe restringir accesos administrativos con los guards y roles ya configurados en el sistema.

## 2. Rendimiento y escalabilidad (RNF-R)
- **RNF-R1 (Tiempo de respuesta):** Los endpoints de consulta de disponibilidad y de gestión de horarios deben responder en un tiempo razonable bajo tráfico normal.
- **RNF-R2 (Concurrencia):** El sistema debe evitar condiciones de carrera en la creación y actualización de horarios y reservas, especialmente cuando dos operaciones concurrentes intentan ocupar el mismo bloque.
- **RNF-R3 (Consultas por fecha):** La consulta de disponibilidad debe estar optimizada para filtrar por `fecha`, `canchaId` y rango horario sin cargar innecesariamente toda la base de datos.

## 3. Usabilidad y accesibilidad (RNF-U)
- **RNF-U1 (Diseño adaptativo / responsive):** Las vistas del frontend deben ser responsivas para uso en escritorio y móvil.
- **RNF-U2 (Retroalimentación visual):** El sistema debe proporcionar mensajes claros de éxito, validación y errores en la operación de agendamiento o administración.

## 4. Portabilidad y disponibilidad (RNF-D)
- **RNF-D1 (Base de datos relacional):** El almacenamiento persistente debe utilizar PostgreSQL y las conexiones deben configurarse a través de variables de entorno.
- **RNF-D2 (Disponibilidad):** La aplicación backend debe estar preparada para despliegue stateless en entornos cloud o contenedores.
- **RNF-D3 (Configuración externa):** Los secretos y configuraciones sensibles deben mantenerse fuera del código fuente y cargarse mediante variables de entorno.

---

## 5. Coherencia con el proyecto

1. El spec no funcional debe reflejar la infraestructura ya utilizada por el proyecto: `bcrypt`, `JWT`, `passport-jwt` y PostgreSQL.
2. Todo requisito de seguridad o disponibilidad debe ser trazable a una configuración actual del backend o a una política de despliegue documentada.
3. Los requerimientos relacionados con reservas deben mantenerse en una categoría clara de `pendiente` si aún no han sido implementados en el servicio correspondiente.
4. Los objetivos de rendimiento no deben sobreespecificar un comportamiento que el backend aún no ha validado en pruebas reales.