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
Desarrollar una plataforma web que permita gestionar actividades académicas y facilite la interacción entre estudiantes y docentes, ayudando a mejorar la organización, el seguimientos de tareas y la comunicación dentro de un entorno educativo.  

### ✅ Objetivos Específicos  
- Diseñar un sistema que permita la creación y consulta de actividades académicas de manera clara y organizada  
- Implementar una funcionalidad que permita a los estudiantes realizar una entrega de forma digital de sus actividades 
- Desarrollar un modulo para que los docentes puedan revisar, calificar y proporcionar una retroalimentación sobre las actividades entregadas  
- Facilitar la comunicación entre estudiantes y docentes mediante el uso de herramientas digitales integradas en la plataforma  
- Garantizar una experiencia de usuario UX intuitiva, rápida y accesible para todos los usuarios.  

---

## 📂 3. Alcance del Proyecto  

### ✔️ Alcance funcional  
El sistema permitirá:  
- Registro e inicio de sesión de usuarios de los roles asociados (estudiante y docente)  
- Creación de actividades académicas por parte del docente. 
- Visualización de actividades por parte del estudiante.  
- Entrega de tareas  
- Revisión y retroalimentación de actividades entregas por parte del docente.
- estión básica de perfiles de usuario. 

### 🚫 Fuera de alcance  
- Integración con plataformas externas (como sistemas institucionales)  
- Funcionalidades de videoconferencias o clases en tiempo real  
- Implementación de grabaciones de sesiones (tutorías, monitorias, material de apoyo)
- Aplicación móvil (App)
- Sistema de reportes avanzados

### 🎁 Beneficios esperados  
- Mejora la organización de actividades académicas  
- Mejora la organización de actividades académicas  
- Fortalecerá la comunicación entre estudiantes y docentes
- Reducirá fallas asociadas a la desorganización
- Promoverá el uso de herramientas digitales en entornos educativos para mejorar el aprendizaje.

---

## 🔄 4. Metodología de Desarrollo (Scrum)  

### 📌 Descripción  
Scrum es una metodología ágil basada en Sprints que permite el desarrollo iterativo e incremental del software.  

### 👨‍💻 Roles  
- Product Owner (Alejandro Rodriguez): Define y prioriza los requisitos del sistema, asegurando que las funcionalidades de registro, autenticación y gestión de usuarios cumplan con las necesidades del proyecto.  
- Scrum Master (Andrés Luengas): Facilita el desarrollo del sprint, organiza las reuniones y elimina impedimentos, garantizando el cumplimiento de la metodología Scrum.  
- El equipo de desarrollo (Andrés y Alejandro): Implementa las funcionalidades del sistema, incluyendo el registro de usuarios, inicio de sesión, gestión de roles y edición de perfil, además de la estructura inicial de la base de datos.
-  Tester (Andrés Luengas): Validará que todas las funcionalidades desarrolladas funcionen correctamente, verificando la seguridad de los datos, la correcta autenticación y la usabilidad de la interfaz.

### 🔁 Organización  
- Sprints de 1–2 semanas  
- Planificación de actividades
- Desarrollo de funcionalidades
- Revisión de avances
- Revisión de avances

### 🛠️ Herramientas  
- Jira 
- GitHub
- Node.js y Express
- React
- Mongo
- Figma
- DevOps

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
- Frontend: interfaz gráfica con diseño accesible desde navegador web  
- Backend: nos encargamos principalmente de la lógica del sistema gestión de actividades y procesamientos de datos   
- Base de datos: almacenaremos información roles y datos de forma segura   

### 🧰 Tecnologías  

Las tecnologías seleccionadas para el desarrollo del proyecto son:  

- Figma: Se utilizara para el diseño de interfaces y prototipos, ayudando a la planeación de la experiencia del usuario UX. 
- React: Se utilizara para el desarrollo del frontend ayudando a la creación de la interfaz de usuario IU sea dianmica e interactiva.  
- Node.js y Express: Se utilizaran para el desarrollo del backend, permitiendo la gestión de lógica del server.  
- Mongo:  Se utilizara para el almacenamiento y gestión de la información.  
- GitHub: Se utilizara para el control de versiones de código, documentación de forma colaborativa entre los integrantes del equipo. 

Estas tecnologías fueron seleccionadas por su eficiencia en el desarrollo de aplicaciones web modernas, permitiendo una arquitectura escalable, segura y de fácil mantenimiento. 

### 🎯 Beneficios  
- Los principales beneficios es la centralización de la información sobre tareas trabajos y demás actividades relacionadas también se tendrá en cuanta la mejoría en la organización y seguimiento de la actividades acompañadas con una mejora efectiva haciendo que los errores sean reducidos.

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

Proyecto en fase de final (Actividad 6).  

---

### 🚀 Guía de Instalación y Ejecución Local

Para realizar tareas de mantenimiento, desarrollo de nuevas funcionalidades o ejecución de pruebas unitarias en un entorno local seguro, siga estos pasos:

#### 1. Requisitos Previos
Antes de iniciar, asegúrese de tener instalado en su sistema:
• Node.js (Versión 18 LTS o superior)
• Git
• MongoDB 

#### 2. Clonar el Repositorio
Abra su terminal y descargue el código fuente del proyecto desde GitHub:
bash
git clone https://github.com/AndresFl20/Proyecto-de-Software.git
cd Proyecto-de-Software


#### 3. Instalar Dependencias
Dado que el núcleo de la aplicación (backend, frontend y modelos) se encuentra centralizado, navegue a la carpeta contenedora e instale los paquetes de Node.js necesarios:
bash
cd funcionalidades
npm install


#### 4. Configurar Variables de Entorno (.env)
Cree un archivo llamado '.env' dentro de la carpeta 'funcionalidades' y configure las credenciales base para desarrollo local (este archivo está protegido en el .gitignore para evitar fugas de información):
env
PORT=4000
MONGO_URI=mongodb://localhost:27017/edutech_local
JWT_SECRET=ClaveSecretaDeDesarrollo123


#### 5. Ejecutar el Proyecto
Para iniciar el servidor de Express en modo de desarrollo con recarga automática, ejecute:
npm run dev


Una vez levantado, abra su navegador e ingrese a 'http://localhost:4000' para interactuar con la plataforma de forma local sin afectar el servidor de producción.
---
## 🫱🏽‍🫲🏽 Autores  

- Andrés Felipe Luengas  
- Alejandro Rodriguez Guarnizo  

