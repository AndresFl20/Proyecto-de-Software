# 📚 Proyecto de Software | CORPORACIÓN UNIVERSITARIA IBEROAMERICANA  

**Docente:** Tatiana Cabrera  
**Curso:** 23022026_C12_202631  
**Actividad 2:** Documento de formulación del proyecto  

**Proyecto:**  
EduTech — Plataforma de Aprendizaje Colaborativo  

---

## ✍🏽 1. Necesidad y Problema del Proyecto  

### 📌 Descripción del problema  
En muchas instituciones educativas, la gestión de actividades académicas se realiza mediante herramientas no centralizadas o procesos manuales, lo que genera desorganización, pérdida de información y dificultades en la comunicación entre docentes y estudiantes.  

### 🌍 Contexto del problema  
El problema se presenta en el sector educativo, especialmente en instituciones que no cuentan con plataformas digitales accesibles para la gestión académica.  

### 👥 Población afectada  
- Estudiantes: Requieren una mejor organización de las actividades académicas y un acceso rápido y eficiente a la información.
- Docentes  
- Docentes: Necesitan una herramienta que les permita gestionar tareas, realizar seguimiento y proporcionar retroalimentación de forma eficiente.

### 💡 Justificación de la solución tecnológica  
La solución tecnológica EduTech permite optimizar la gestión de actividades académicas mediante la digitalización de procesos. Una plataforma web centralizada ayuda a el acceso de la información, mejorando la comunicación entre estudiantes y docentes reduciendo arroces asociados a la desorganización.

Ademas, el uso de herramientas digitales contribuye a aumentar la eficiencia en el proceso educativo, promoviendo entornos de aprendizaje mas organizados, accesibles y acordes a las necesidades actuales.  

---

## 🎯 2. Objetivos del Proyecto  

### 🎯 Objetivo General  
Desarrollar una plataforma web que permita gestionar actividades académicas y facilitar la interacción entre estudiantes y docentes.  

### ✅ Objetivos Específicos  
- Implementar registro e inicio de sesión de usuarios  
- Permitir la publicación de actividades académicas  
- Facilitar la entrega digital de tareas  
- Implementar retroalimentación docente  
- Mejorar la organización académica  

---

## 📂 3. Alcance del Proyecto  

### ✔️ Alcance funcional  
El sistema permitirá:  
- Registro de usuarios  
- Publicación de actividades  
- Entrega de tareas  
- Retroalimentación  
- Consulta de estado de tareas  

### 🚫 Fuera de alcance  
- Aplicación móvil  
- Sistemas de pago  
- Integraciones externas complejas  

### 🎁 Beneficios esperados  
- Organización académica eficiente  
- Comunicación fluida  
- Acceso centralizado a la información  

---

## 🔄 4. Metodología de Desarrollo (Scrum)  

### 📌 Descripción  
Scrum es una metodología ágil basada en Sprints que permite el desarrollo iterativo e incremental del software.  

### 👨‍💻 Roles  
- Product Owner  
- Scrum Master  
- Equipo de desarrollo  

### 🔁 Organización  
- Sprints de 1–2 semanas  
- Planificación, revisión y retrospectiva  

### 🛠️ Herramientas  
- GitHub  
- Git  
- Jira  

---

## 📋 5. Requisitos del Sistema  

### ✔️ Requisitos Funcionales  

| Código  | Nombre                        | Descripción                                                                 | Usuarios            | Prioridad |
|--------|------------------------------|----------------------------------------------------------------------------|---------------------|----------|
| RQF001 | Autenticación y autorización | Permite inicio de sesión con roles (estudiante, docente). | Todos | Alta |
| RQF002 | Registro de usuarios         | Registro de nuevos usuarios con datos básicos. | Estudiante / Docente | Alta |
| RQF003 | Gestión de perfiles          | Visualizar y actualizar información personal. | Todos | Media |
| RQF004 | Publicación de actividades   | Crear, editar y eliminar actividades. | Docente | Alta |
| RQF005 | Visualización de actividades | Consultar actividades asignadas. | Estudiante | Alta |
| RQF006 | Entrega de tareas            | Subir tareas en formato digital. | Estudiante | Alta |
| RQF007 | Gestión de entregas          | Visualizar tareas entregadas. | Docente | Alta |
| RQF008 | Retroalimentación            | Calificar y comentar tareas. | Docente | Alta |
| RQF009 | Notificaciones              | Avisos de actividades y retroalimentación. | Estudiante | Media |
| RQF010 | Estado de tareas            | Consultar estado de tareas. | Estudiante | Media |

---

### ⚙️ Requisitos No Funcionales  

| ID      | Categoría              | Descripción                                                                 | Prioridad |
|--------|----------------------|----------------------------------------------------------------------------|----------|
| RQNF001 | Usabilidad            | Interfaz clara, intuitiva y fácil de usar. | Alta |
| RQNF002 | Rendimiento           | Carga rápida del sistema. | Alta |
| RQNF003 | Seguridad             | Protección de datos mediante autenticación segura. | Alta |
| RQNF004 | Disponibilidad        | Disponibilidad del 95% del tiempo. | Alta |
| RQNF005 | Mantenibilidad        | Facilidad para futuras actualizaciones. | Media |
| RQNF006 | Integridad de datos   | Protección contra pérdida o corrupción de datos. | Alta |
| RQNF007 | Respaldo              | Copias de seguridad periódicas. | Media |

---

## 👥 6. Stakeholders y Usuarios  

### 📌 Stakeholders  
- Instituciones educativas  
- Administradores del sistema  

### 👤 Usuarios finales  
- Estudiantes  
- Docentes  

---

## 🧠 7. Historias de Usuario  

| ID      | Historia |
|--------|--------|
| HIU001 | Como estudiante, quiero ver actividades para organizar mis tareas. |
| HIU002 | Como estudiante, quiero subir tareas para cumplir con actividades. |
| HIU003 | Como docente, quiero publicar actividades. |
| HIU004 | Como docente, quiero revisar tareas. |
| HIU005 | Como docente, quiero dar retroalimentación. |
| HIU006 | Como estudiante, quiero recibir notificaciones. |
| HIU007 | Como usuario, quiero iniciar sesión de forma segura. |
| HIU008 | Como usuario, quiero registrarme en el sistema. |
| HIU009 | Como estudiante, quiero ver el estado de mis tareas. |
| HIU010 | Como usuario, quiero editar mi información personal. |

---

## 🔀 8. Flujo del Sistema  

1. Usuario se registra o inicia sesión  
2. Docente publica actividad  
3. Estudiante consulta actividad  
4. Estudiante entrega tarea  
5. Docente revisa y retroalimenta  

---

## 💻 9. Solución Tecnológica  

### 📌 Descripción  
Plataforma web para gestión académica y aprendizaje colaborativo.  

### 🏗️ Arquitectura  
- Frontend  
- Backend  
- Base de datos  

### 🧰 Tecnologías  

Las tecnologías seleccionadas para el desarrollo del proyecto son:  

- Frontend: HTML, CSS y JavaScript  
- Backend: Node.js con Express  
- Base de datos: MongoDB  
- Autenticación: JSON Web Tokens (JWT)  
- Control de versiones: Git y GitHub  

Estas tecnologías fueron seleccionadas por su eficiencia en el desarrollo de aplicaciones web modernas, permitiendo una arquitectura escalable, segura y de fácil mantenimiento. 

### 🎯 Beneficios  
- Digitalización del proceso educativo  
- Mejor comunicación  
- Organización eficiente  

---

## 📊 10. Modelamiento del Sistema  

### 📌 Diagramas  
- Diagrama de clases  
- Diagrama de casos de uso  
- Diagrama de actividades  

### 🗄️ Entidades principales  
- Usuario  
- Actividad  
- Entrega  
- Retroalimentación  

---

## 🏁 Estado del Proyecto  

Proyecto en fase de formulación y planeación (Actividad 2).  

---

## 🫱🏽‍🫲🏽 Autores  

- Andrés Felipe Luengas  
- Alejandro Rodriguez Guarnizo  
