# Blueprint del Proyecto: Nexus

## Visión General

Nexus es una aplicación web moderna diseñada para actuar como un intermediario de confianza entre dos partes que realizan un acuerdo de servicio. La aplicación permite a los usuarios crear contratos, definir objetivos y, en el futuro, gestionar pagos de forma segura. Está construida con Next.js, Firebase y Tailwind CSS.

---

## Puntos de Control y Características Implementadas

### ✅ **Punto de Control 1: Autenticación de Usuarios (Completado)**
- **Funcionalidad:** Sistema completo de registro e inicio de sesión de usuarios.
- **Tecnología:** Firebase Authentication con gestión de sesiones basada en cookies seguras (HttpOnly).
- **Páginas Creadas:** `/login`, `/signup`, `/forgot-password`.
- **Seguridad:** Middleware (`middleware.ts`) que protege las rutas privadas, validando la cookie de sesión en el servidor antes de permitir el acceso.

### ✅ **Punto de Control 2: Creación y Gestión de Acuerdos (Completado)**
- **Funcionalidad:** Los usuarios pueden crear servicios, definir los términos y visualizar los detalles.
- **Dashboard (`/dashboard`):**
    - Muestra una lista de servicios en los que el usuario es creador o participante.
    - Permite crear un nuevo servicio a través de un formulario modal.
- **Página de Acuerdo (`/service/[serviceId]`):**
    - Muestra los detalles completos del servicio, incluyendo creador, participante y los términos del acuerdo.
    - El creador puede editar los términos del acuerdo mientras el servicio está en estado `pending_agreement`.
- **Modelo de Datos (Firestore):**
    - Colección `services` que almacena los detalles de cada acuerdo, incluyendo `creatorId`, `participantId`, `title`, `status` y `agreement`.
    - Colección `users` para almacenar información adicional del usuario.
- **Lógica de Backend (Server Actions):**
    - `createNewService`: Para crear un nuevo servicio.
    - `saveAgreementTerms`: Para que el creador guarde los términos del acuerdo.

---

## Plan de Desarrollo Actual

### 🎯 **Punto de Control 3: Aceptación del Acuerdo y Activación del Servicio (En Progreso)**

**Objetivo:** Permitir que el participante acepte formalmente los términos propuestos por el creador, cambiando el estado del servicio a "activo" y bloqueando la edición de los términos.

**Pasos de Acción:**

1.  **[Pendiente]** **Crear la Acción de Servidor `acceptAgreement`:**
    - Recibirá el `serviceId` como argumento.
    - Verificará que el usuario que llama a la acción es el `participantId` del servicio.
    - Validará que el estado actual del servicio sea `pending_agreement`.
    - Si todo es correcto, actualizará el estado del servicio en Firestore a `active`.
    - Implementará manejo de errores para casos no autorizados o inválidos.

2.  **[Pendiente]** **Actualizar la Interfaz de Usuario (`AgreementClientPage`):**
    - Añadir un botón "Aceptar Acuerdo y Activar".
    - Este botón solo será visible y estará habilitado para el **participante** del servicio.
    - El botón solo debe mostrarse si el estado del servicio es `pending_agreement`.
    - El texto del acuerdo (`textarea`) será de solo lectura para el participante.

3.  **[Pendiente]** **Conectar la Interfaz con la Lógica:**
    - El botón "Aceptar Acuerdo" invocará la nueva acción de servidor `acceptAgreement`.
    - Se mostrará un estado de carga en el botón mientras la operación se completa.
    - Una vez aceptado, la página debería reflejar el nuevo estado "activo", y el botón de aceptar debería desaparecer.
