# Sistema de Cursos y Niveles - Freenglish

## Estructura de Páginas

### 1. Página Principal de Cursos (`/cursos`)
- Muestra todos los cursos disponibles
- Cada curso tiene un botón "Ver más" que redirige a la página específica del curso

### 2. Página de Curso Específico (`/cursos/[curso]`)
- Muestra los niveles disponibles para un curso específico
- Incluye:
  - Información del curso (título, descripción)
  - Lista de niveles con detalles
  - Estadísticas de docentes disponibles
  - Resumen de horarios disponibles
  - Botón para ver docentes y horarios detallados

### 3. Página de Nivel Específico (`/cursos/[curso]/[nivel]`)
- Muestra los docentes disponibles para un nivel específico
- Incluye:
  - Información del nivel
  - Lista de docentes con perfiles completos
  - Horarios disponibles para cada docente
  - Opciones de inscripción

## Cursos Disponibles

### 1. Inglés Básico (`ingles-basico`)
- **Nivel A1 - Principiante**: Fundamentos básicos del inglés
- **Nivel A2 - Elemental**: Desarrollo de habilidades comunicativas básicas

### 2. Inglés Intermedio (`ingles-intermedio`)
- **Nivel B1 - Intermedio Bajo**: Comunicación independiente en situaciones cotidianas
- **Nivel B2 - Intermedio Alto**: Fluidez en conversaciones complejas

### 3. Inglés Avanzado (`ingles-avanzado`)
- **Nivel C1 - Avanzado**: Dominio del idioma para contextos académicos y profesionales
- **Nivel C2 - Maestría**: Nivel nativo para comunicación experta

## Características de los Docentes

Cada docente incluye:
- **Nombre y especialidad**
- **Años de experiencia**
- **Rating promedio**
- **Número de estudiantes**
- **Múltiples horarios disponibles**
- **Modalidad (Online/Presencial)**
- **Cupos disponibles**

## Horarios Disponibles

### Modalidades
- **Online**: Clases virtuales con diferentes horarios
- **Presencial**: Clases en aula física

### Horarios Típicos
- **Lunes y Miércoles**: 18:00 - 19:30, 19:00 - 20:30
- **Martes y Jueves**: 18:30 - 20:00, 20:00 - 21:30
- **Viernes**: 17:00 - 19:30
- **Sábados**: 10:00 - 12:00, 14:00 - 16:00

## Estructura de Archivos

```
app/
├── cursos/
│   ├── page.tsx                    # Página principal de cursos
│   ├── [curso]/
│   │   ├── page.tsx               # Página de curso específico
│   │   └── [nivel]/
│   │       └── page.tsx           # Página de nivel específico
├── data/
│   └── cursos.ts                  # Datos centralizados de cursos y docentes
├── types/
│   └── cursos.ts                  # Tipos TypeScript
└── components/
    ├── HorariosResumen.tsx        # Componente de resumen de horarios
    └── EstadisticasDocentes.tsx   # Componente de estadísticas
```

## Funcionalidades

### Navegación
- Navegación jerárquica: Cursos → Niveles → Docentes
- Botones de regreso en cada página
- Enlaces dinámicos basados en parámetros de URL

### Información Detallada
- Estadísticas de docentes por nivel
- Resumen de horarios disponibles
- Información completa de cada docente
- Estado de disponibilidad de horarios

### Interactividad
- Selección de horarios
- Botones de inscripción
- Estados visuales para horarios seleccionados

## Tecnologías Utilizadas

- **Next.js 14** con App Router
- **TypeScript** para tipado estático
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **Shadcn/ui** para componentes de UI

## Datos de Ejemplo

El sistema incluye datos de ejemplo con:
- 3 cursos principales
- 6 niveles en total
- 7 docentes diferentes
- Múltiples horarios por docente
- Información realista de ratings y estudiantes 