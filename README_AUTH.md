# Sistema de Autenticación Temporal - Freenglish

## 🎯 **Funcionalidades Implementadas**

### **1. Sistema de Autenticación Temporal**
- ✅ **Sin base de datos** - Usa localStorage para persistencia
- ✅ **Login funcional** - Credenciales de prueba incluidas
- ✅ **Registro funcional** - Crea nuevos usuarios temporalmente
- ✅ **Logout** - Cierra sesión y limpia datos
- ✅ **Persistencia** - Mantiene sesión entre recargas

### **2. Navegación Inteligente**
- ✅ **Botón "Comenzar Ahora"** - Redirige según estado de autenticación
- ✅ **Botones "Comenzar Nivel"** - Redirigen a niveles específicos
- ✅ **Eliminación del botón "Ver Demo"** - Como solicitado
- ✅ **Header dinámico** - Muestra usuario logueado o enlaces de login/registro

## 🔐 **Credenciales de Prueba**

### **Usuario Demo Principal:**
- **Email:** `estudiante@demo.com`
- **Contraseña:** `123456`

### **Usuarios Demo Alternativos:**
- **Email:** Cualquier email que contenga "demo" (ej: `demo@test.com`, `mydemo@email.com`)
- **Contraseña:** `123456`

### **Registro de Nuevos Usuarios:**
- Cualquier email y contraseña válida
- Mínimo 6 caracteres para contraseña
- Se crea automáticamente como estudiante

## 🚀 **Flujo de Navegación**

### **Sin Sesión Iniciada:**
1. **Botón "Comenzar Ahora"** → `/register`
2. **Botón "Comenzar Nivel"** → `/register`
3. **Header** → Muestra "Login" y "Registro"

### **Con Sesión Iniciada:**
1. **Botón "Comenzar Ahora"** → `/cursos`
2. **Botón "Comenzar Nivel A1-A2"** → `/cursos/ingles-basico/a1`
3. **Botón "Comenzar Nivel B1-B2"** → `/cursos/ingles-intermedio/b1`
4. **Botón "Comenzar Nivel C1-C2"** → `/cursos/ingles-avanzado/c1`
5. **Header** → Muestra nombre del usuario y "Cerrar Sesión"

## 📁 **Archivos Modificados/Creados**

### **Nuevos Archivos:**
```
contexts/
└── AuthContext.tsx          # Contexto de autenticación

README_AUTH.md               # Esta documentación
```

### **Archivos Modificados:**
```
app/
├── layout.tsx               # Agregado AuthProvider
├── page.tsx                 # Lógica de navegación y autenticación
├── login/page.tsx           # Login funcional con validaciones
└── register/page.tsx        # Registro funcional con validaciones
```

## 🎨 **Características de UI/UX**

### **Página de Login:**
- ✅ Formulario con validaciones
- ✅ Mostrar/ocultar contraseña
- ✅ Estados de carga
- ✅ Mensajes de error
- ✅ Credenciales de prueba visibles
- ✅ Diseño responsive

### **Página de Registro:**
- ✅ Formulario completo con validaciones
- ✅ Confirmación de contraseña
- ✅ Validación de longitud mínima
- ✅ Estados de carga
- ✅ Mensajes de error
- ✅ Información sobre gratuidad

### **Header Dinámico:**
- ✅ Muestra nombre del usuario cuando está logueado
- ✅ Botón de cerrar sesión
- ✅ Enlaces de login/registro cuando no está logueado
- ✅ Diseño responsive

## 🔧 **Tecnologías Utilizadas**

- **React Context API** - Para estado global de autenticación
- **localStorage** - Para persistencia de sesión
- **Next.js Router** - Para navegación programática
- **TypeScript** - Para tipado seguro
- **Tailwind CSS** - Para estilos
- **Shadcn/ui** - Para componentes de UI

## 🧪 **Cómo Probar**

### **1. Probar Login:**
1. Ve a `/login`
2. Usa las credenciales: `estudiante@demo.com` / `123456`
3. Deberías ser redirigido a `/cursos`

### **2. Probar Registro:**
1. Ve a `/register`
2. Completa el formulario con cualquier email válido
3. Deberías ser redirigido a `/cursos`

### **3. Probar Navegación:**
1. Inicia sesión
2. Ve a la página principal
3. Prueba los botones "Comenzar Nivel" - deberían llevarte a niveles específicos
4. Prueba el botón "Comenzar Ahora" - debería llevarte a `/cursos`

### **4. Probar Logout:**
1. Inicia sesión
2. Haz clic en "Cerrar Sesión" en el header
3. Deberías volver al estado sin sesión

## 🔄 **Persistencia de Datos**

- Los datos de usuario se guardan en `localStorage`
- La sesión persiste entre recargas de página
- Al cerrar sesión se eliminan los datos del `localStorage`
- No hay base de datos real - es solo para demostración

## 🚀 **Próximos Pasos**

Para implementar una base de datos real:
1. Reemplazar `localStorage` con llamadas a API
2. Implementar JWT o sesiones del servidor
3. Agregar validaciones de email únicos
4. Implementar recuperación de contraseña
5. Agregar autenticación social (Google, Facebook, etc.) 