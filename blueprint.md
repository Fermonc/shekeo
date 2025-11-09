# Blueprint del Proyecto: Nexus

## Visión General

Nexus es una aplicación web moderna diseñada para actuar como un intermediario de confianza entre dos partes que realizan un acuerdo de servicio. La aplicación permite a los usuarios crear contratos, definir objetivos, financiar un depósito de garantía (escrow) y liberar los pagos de forma segura a medida que se completan los hitos, todo con la confirmación de ambas partes. Está construida con Next.js, Firebase y Tailwind CSS.

---

## Puntos de Control y Características Implementadas

### ✅ **Punto de Control 1: Autenticación de Usuarios (Completado)**
- **Funcionalidad:** Sistema de registro e inicio de sesión de usuarios implementado.
- **Tecnología:** Se utiliza **Firebase Authentication** para el backend.
- **Páginas Creadas:**
  - `/login`: Inicio de sesión de usuario.
  - `/signup`: Registro de nuevo usuario.
  - `/forgot-password`: Restablecimiento de contraseña.
- **Seguridad:**
  - Se implementó un middleware (`middleware.ts`) que protege las rutas (como `/dashboard`) verificando una cookie de sesión del lado del servidor.
  - La cookie de sesión se crea de forma segura a través de una Acción de Servidor (`createSession`) que valida un token de ID de Firebase.

---

## Plan de Desarrollo Actual

**Solicitud del Usuario:** Desarrollar el núcleo de la aplicación: un sistema de acuerdos y depósito en garantía (escrow) entre dos partes.

### 🎯 **Punto de Control 2: Creación y Vinculación de Servicios (En Progreso)**

El objetivo es permitir que un usuario cree un "servicio" (el contrato) y que un segundo usuario se vincule a él mediante un código único.

**Pasos de Acción:**

1.  **[Pendiente]** **Diseñar el Dashboard:** Crear la interfaz de usuario principal en `/dashboard` donde los usuarios verán sus servicios y podrán crear o unirse a nuevos.
2.  **[Pendiente]** **Definir el Modelo de Datos (Firestore):** Estructurar cómo se almacenarán los datos de los servicios en la base de datos de Firestore. Incluirá campos como `creatorId`, `participantId`, `inviteCode`, `status`, `title`, etc.
3.  **[Pendiente]** **Crear Acción de Servidor para "Crear Servicio":** Implementar la lógica de backend para que un usuario pueda crear un nuevo servicio, generando un código de invitación único y guardándolo en Firestore.
4.  **[Pendiente]** **Crear Acción de Servidor para "Unirse a Servicio":** Implementar la lógica para que un segundo usuario pueda usar el código de invitación para vincularse a un servicio existente.
5.  **[Pendiente]** **Listar Servicios en el Dashboard:** Mostrar al usuario una lista de los servicios en los que participa (ya sea como creador o como participante).
