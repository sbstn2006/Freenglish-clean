# Páginas de Perfil - Freenglish

## Descripción General

Se han implementado páginas de perfil específicas para docentes y estudiantes con datos simulados, siguiendo la estructura de CRUD descrita en los requerimientos.

## Estructura de Archivos

```
app/
├── perfil/
│   ├── page.tsx              # Página principal que redirige según el rol
│   ├── estudiante/
│   │   └── page.tsx          # Perfil de estudiante
│   └── docente/
│       └── page.tsx          # Perfil de docente
components/
└── Navigation.tsx            # Componente de navegación reutilizable
```

## Funcionalidades Implementadas

### 🎯 Página Principal de Perfil (`/perfil`)

- **Redirección automática**: Detecta el rol del usuario basándose en el email
- **Autenticación**: Verifica que el usuario esté logueado
- **Roles soportados**:
  - `docente` o `teacher` → `/perfil/docente`
  - `estudiante` o `student` → `/perfil/estudiante`
  - Por defecto → `/perfil/estudiante`

### 👨‍🎓 Perfil de Estudiante (`/perfil/estudiante`)

#### Características:
- **Estadísticas generales**: Total cursos, asistencia promedio, clases completadas, horas estudiadas
- **Gestión de cursos inscritos**: Ver progreso, asistencia y opción de darse de baja
- **Edición de perfil**: Cambiar nombre y correo electrónico
- **Navegación integrada**: Acceso a cursos, calendario y página principal

#### Datos Simulados:
- 3 cursos inscritos con diferentes niveles de progreso
- Estadísticas de asistencia y progreso
- Información de docentes asignados

#### Funcionalidades CRUD:
- ✅ **Leer**: Ver cursos inscritos y progreso
- ✅ **Actualizar**: Editar información del perfil
- ✅ **Eliminar**: Darse de baja de cursos (con confirmación)

### 👨‍🏫 Perfil de Docente (`/perfil/docente`)

#### Características:
- **Estadísticas de enseñanza**: Total estudiantes, horarios activos, asistencia promedio, clases impartidas
- **Gestión de horarios**: Crear, editar y eliminar horarios de disponibilidad
- **Lista de estudiantes**: Ver estudiantes inscritos y marcar asistencia
- **Edición de perfil**: Cambiar información personal

#### Datos Simulados:
- 4 horarios activos en diferentes días
- 4 estudiantes con información de asistencia
- Estadísticas de enseñanza

#### Funcionalidades CRUD:

**Horarios:**
- ✅ **Crear**: Agregar nuevos horarios con día, hora inicio/fin y curso
- ✅ **Leer**: Ver todos los horarios activos
- ✅ **Actualizar**: Editar horarios existentes (interfaz preparada)
- ✅ **Eliminar**: Eliminar horarios (con confirmación)

**Estudiantes:**
- ✅ **Leer**: Ver lista de estudiantes con estadísticas
- ✅ **Actualizar**: Marcar asistencia (presente/ausente)

## Componentes Reutilizables

### Navigation.tsx
- Navegación consistente en todas las páginas de perfil
- Información del usuario en el header
- Enlaces a secciones principales
- Botón de cerrar sesión

## Datos Simulados

### Estudiante (María González)
```javascript
{
  name: "María González",
  email: "maria.estudiante@example.com",
  cursosInscritos: [
    {
      nombre: "Inglés Básico",
      docente: "Prof. Sarah Johnson",
      progreso: 75,
      asistencia: 93
    },
    // ... más cursos
  ]
}
```

### Docente (Sarah Johnson)
```javascript
{
  name: "Prof. Sarah Johnson",
  email: "sarah.docente@example.com",
  especialidad: "Inglés Conversacional",
  horarios: [
    {
      dia: "lunes",
      horaInicio: "09:00",
      horaFin: "11:00",
      curso: "Inglés Básico",
      estudiantes: 12
    },
    // ... más horarios
  ],
  estudiantes: [
    {
      nombre: "María González",
      curso: "Inglés Básico",
      asistencia: 15,
      totalClases: 16
    },
    // ... más estudiantes
  ]
}
```

## Navegación

### Desde la página principal:
- Usuarios autenticados ven un botón "Mi Perfil" en la navegación
- Al hacer clic, se redirige automáticamente según el rol

### Desde las páginas de perfil:
- Navegación consistente con enlaces a:
  - Inicio (`/`)
  - Cursos (`/cursos`)
  - Calendario (`/calendario`)
- Información del usuario en el header
- Botón de cerrar sesión

## Tecnologías Utilizadas

- **Next.js 14** con App Router
- **TypeScript** para tipado estático
- **Tailwind CSS** para estilos
- **Shadcn/ui** para componentes de interfaz
- **Lucide React** para iconos
- **Context API** para gestión de estado de autenticación

## Próximos Pasos

1. **Integración con Base de Datos**: Reemplazar datos simulados con consultas reales
2. **Autenticación de Roles**: Implementar sistema de roles en el backend
3. **Funcionalidades Adicionales**:
   - Cambio de contraseña
   - Subida de avatar
   - Notificaciones
   - Historial de actividades
4. **Panel de Administrador**: Gestión de usuarios y cursos
5. **Validaciones**: Formularios con validación de datos

## Notas de Desarrollo

- Los datos están simulados para demostración
- La detección de roles se basa en el email del usuario
- Todas las acciones CRUD están preparadas para integración con API
- La interfaz es responsive y accesible
- Se mantiene consistencia visual con el resto de la aplicación 