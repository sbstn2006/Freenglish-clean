# 🔐 Credenciales de Prueba - Freenglish

## ⚠️ IMPORTANTE
Estas credenciales son **SOLO PARA DESARROLLO Y TESTING**. En producción, el sistema usará autenticación real con el backend.

## 👨‍🎓 **Usuarios Estudiante**

| Email | Contraseña | Nombre | Rol |
|-------|------------|--------|-----|
| `maria.estudiante@example.com` | `estudiante123` | María González | Estudiante |
| `carlos.estudiante@example.com` | `123456` | Carlos Rodríguez | Estudiante |
| `ana.estudiante@example.com` | `123456` | Ana Martínez | Estudiante |
| `luis.estudiante@example.com` | `123456` | Luis Pérez | Estudiante |
| `juan.student@test.com` | `123456` | Juan Student | Estudiante |
| `maria.student@test.com` | `123456` | María Student | Estudiante |

## 👨‍🏫 **Usuarios Docente**

| Email | Contraseña | Nombre | Rol |
|-------|------------|--------|-----|
| `sarah.docente@example.com` | `docente123` | Prof. Sarah Johnson | Docente |
| `michael.docente@example.com` | `123456` | Prof. Michael Brown | Docente |
| `emily.docente@example.com` | `123456` | Prof. Emily Davis | Docente |
| `john.teacher@test.com` | `123456` | Prof. John Teacher | Docente |
| `sarah.teacher@test.com` | `123456` | Prof. Sarah Teacher | Docente |

## 👨‍💼 **Usuarios Administrador**

| Email | Contraseña | Nombre | Rol |
|-------|------------|--------|-----|
| `admin@freenglish.com` | `admin123` | Administrador | Admin |
| `administrador@test.com` | `123456` | Admin Sistema | Admin |

## 🚀 **Cómo Probar**

### 1. **Login**
1. Ve a `/login`
2. Usa cualquiera de las credenciales de arriba
3. Haz clic en "Iniciar Sesión"

### 2. **Registro (Nuevos Usuarios)**
1. Ve a `/register`
2. Usa un email que NO esté en la lista de arriba
3. Completa el formulario
4. El sistema permitirá el registro

### 3. **Acceso según Rol**
- **Estudiantes**: Serán redirigidos a `/perfil/estudiante`
- **Docentes**: Serán redirigidos a `/perfil/docente`
- **Admins**: Serán redirigidos a `/admin`

## 🧭 **Navegación por Rol**

### **Usuarios NO Autenticados:**
- Niveles
- Testimonios
- Contáctanos
- Login
- Registro

### **Estudiantes Autenticados:**
- Niveles
- Testimonios
- Contáctanos
- Cursos
- Calendario
- Mi Perfil
- Cerrar Sesión

### **Docentes Autenticados:**
- Niveles
- Testimonios
- Contáctanos
- Cursos
- Calendario
- Mi Perfil
- Cerrar Sesión

### **Administradores Autenticados:**
- Niveles
- Testimonios
- Contáctanos
- Estudiantes
- Docentes
- Cursos
- Inscripciones
- Cerrar Sesión

## 🔒 **Seguridad**

### ✅ **Lo que SÍ funciona:**
- Validación de credenciales (email + contraseña)
- Mensajes de error para credenciales inválidas
- Prevención de registro con emails duplicados
- Tokens de autenticación temporales
- Detección automática de roles por email
- Redirección automática según rol

### ❌ **Lo que NO funciona (por diseño):**
- Cualquier contraseña con cualquier email
- Acceso sin credenciales válidas
- Persistencia real de datos (solo localStorage)

## 🧪 **Casos de Prueba**

### **Login Exitoso - Estudiante:**
```
Email: maria.estudiante@example.com
Contraseña: estudiante123
Resultado: ✅ Login exitoso → Perfil de Estudiante
```

### **Login Exitoso - Docente:**
```
Email: sarah.docente@example.com
Contraseña: docente123
Resultado: ✅ Login exitoso → Perfil de Docente
```

### **Login Exitoso - Admin:**
```
Email: admin@freenglish.com
Contraseña: admin123
Resultado: ✅ Login exitoso → Panel de Administración
```

### **Login Fallido:**
```
Email: maria.estudiante@example.com
Contraseña: password123
Resultado: ❌ "Credenciales inválidas"
```

### **Email No Registrado:**
```
Email: usuario.nuevo@test.com
Contraseña: 123456
Resultado: ❌ "Credenciales inválidas"
```

### **Registro Nuevo Usuario:**
```
Email: usuario.nuevo@test.com
Nombre: Usuario Nuevo
Contraseña: 123456
Resultado: ✅ Registro exitoso → Login automático
```

### **Registro Email Duplicado:**
```
Email: maria.estudiante@example.com
Nombre: María Duplicada
Contraseña: 123456
Resultado: ❌ "Este email ya está registrado"
```

## 🔄 **Flujo de Autenticación**

1. **Intento de Login Real**: El sistema intenta conectar al backend
2. **Si Backend Disponible**: Usa autenticación real
3. **Si Backend No Disponible**: Verifica contra usuarios de prueba
4. **Validación**: Solo permite acceso con credenciales válidas
5. **Detección de Rol**: Basada en el email del usuario
6. **Redirección**: Según el rol detectado
7. **Token**: Genera token temporal para mantener sesión

## 📝 **Notas de Desarrollo**

- **Backend Prioridad**: Si el backend está disponible, usa autenticación real
- **Fallback Seguro**: Si no hay backend, solo permite usuarios de prueba
- **No Persistencia**: Los datos se guardan solo en localStorage
- **Tokens Temporales**: Los tokens de prueba expiran al cerrar sesión
- **Detección de Roles**: Automática basada en el email
- **Navegación Dinámica**: Cambia según el rol del usuario

## 🚨 **Para Producción**

Antes de desplegar a producción:
1. Remover el objeto `TEST_USERS`
2. Asegurar que el backend esté funcionando
3. Implementar validación real de tokens
4. Agregar encriptación de contraseñas
5. Implementar refresh tokens
6. Agregar rate limiting
7. Configurar HTTPS
8. Implementar sistema de roles en base de datos 