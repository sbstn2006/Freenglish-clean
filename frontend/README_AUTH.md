# Login Temporal - Freenglish

### 1. Login Temporal
- Sin base de datos - Guarda datos en el navegador
- Login que funciona - Credenciales de prueba
- Cerrar sesión
- Se acuerda de que estoy login

### 2. Navegación cambia según login/register
- Botón Comenzar Ahora lleva donde necesito según si estoy logueado o no
- Botones Comenzar Nivel Me llevan directamente a los niveles específicos
- Sin botón Ver Demo Como pedí
- Header que cambia Muestra nombre cuando estoy logueado o enlaces de login/registro

## Credenciales de test

### Usuario
- Email: `estudiante@demo.com`
- Contraseña: `123456`

### Registrarme:
- Puedo usar cualquier email y contraseña
- La contraseña debe tener al menos 6 letras
- Me crea automáticamente como estudiante

## Cómo Funciona la Navegación

### Si no estoy logueado:
1. Botón Comenzar Ahora lleva a registrarme
2. Botón Comenzar Nivel lleva a registrarme
3. Header - Muestra Login y Registro

### Si estoy logueado:
1. Botón Comenzar Ahora lleva a todos los cursos
2. Botón Comenzar Nivel lleva al nivel correspondiente
3. Header - Muestra nombre y Cerrar Sesión

### Página de Login:
- Formulario que funciona
- Botón para mostrar/ocultar contraseña
- Me dice si algo está mal
- Muestra las credenciales de prueba
- Se ve bien en celular y computadora

### Página de Registro:
- Formulario completo
- Me pide confirmar la contraseña
- La contraseña debe tener al menos 6 letras
- Me dice si algo está mal

### Header que Cambia:
- Muestra mi nombre cuando estoy logueado
- Botón para cerrar sesión
- Muestra Login y Registro cuando no estoy logueado

## Tecnologías que Usa

- React Context API - Para recordar si estoy logueado
- localStorage - Para guardar mi sesión
- Next.js Router - Para navegar entre páginas
- TypeScript - Para que no haya errores
- Tailwind CSS - Para que se vea bonito
- Shadcn/ui - Para los botones y formularios