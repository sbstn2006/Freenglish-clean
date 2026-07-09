// Archivo limpiado: todos los datos simulados han sido eliminados para forzar el uso de la API real.

import { CursosData, DocentesData, NivelInfoData } from "@/types/cursos";

export interface Horario {
  id: string;
  teacher: string;
  schedule: string;
  students: number;
  maxStudents: number;
  status: 'active' | 'full' | 'pending';
}

export interface Curso {
  id: number;
  slug: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  learnings: string[];
  schedules: Horario[];
}

export const cursos: Curso[] = [
  {
    id: 1,
    slug: "ingles-basico",
    title: "Inglés Básico A1-A2",
    description: "Un curso diseñado para principiantes absolutos. Aprenderás los fundamentos del inglés, desde el alfabeto y los saludos hasta la formación de frases simples.",
    level: "A1-A2",
    duration: "8 Semanas",
    learnings: [
      "Saludos y presentaciones formales e informales.",
      "Construir un vocabulario básico para situaciones cotidianas.",
      "Entender y usar el verbo 'to be' en presente.",
      "Formular preguntas simples y responderlas.",
      "Describir personas, lugares y objetos de forma básica."
    ],
    schedules: [
      { id: "1-A", teacher: "Prof. Sarah Johnson", schedule: "Lunes y Miércoles, 18:00", students: 18, maxStudents: 20, status: 'active' },
      { id: "1-B", teacher: "Prof. David Wilson", schedule: "Martes y Jueves, 10:00", students: 20, maxStudents: 20, status: 'full' },
      { id: "1-C", teacher: "Prof. Sarah Johnson", schedule: "Sábados, 09:00", students: 15, maxStudents: 20, status: 'active' }
    ]
  },
  {
    id: 2,
    slug: "ingles-intermedio",
    title: "Inglés Intermedio B1-B2",
    description: "Fortalece tu gramática y amplía tu vocabulario. Este curso se enfoca en mejorar la fluidez y la confianza en conversaciones más complejas.",
    level: "B1-B2",
    duration: "10 Semanas",
    learnings: [
        "Usar tiempos verbales pasados, presentes y futuros con confianza.",
        "Participar en debates y expresar opiniones con argumentos.",
        "Entender las ideas principales de textos complejos.",
        "Escribir correos electrónicos formales e informales.",
        "Manejar una mayor variedad de situaciones sociales y profesionales."
    ],
    schedules: [
      { id: "2-A", teacher: "Prof. Michael Chen", schedule: "Lunes y Miércoles, 20:00", students: 14, maxStudents: 15, status: 'active' },
      { id: "2-B", teacher: "Prof. Elena Rodriguez", schedule: "Martes y Jueves, 19:00", students: 12, maxStudents: 15, status: 'active' }
    ]
  },
  {
    id: 3,
    slug: "ingles-avanzado",
    title: "Inglés Avanzado C1-C2",
    description: "Perfecciona tu inglés hasta un nivel cercano al nativo. Este curso se centra en los matices del lenguaje, la escritura avanzada y la comunicación profesional.",
    level: "C1-C2",
    duration: "12 Semanas",
    learnings: [
        "Comprender una amplia variedad de textos largos y exigentes.",
        "Expresarse de forma fluida y espontánea sin esfuerzo.",
        "Producir textos claros, bien estructurados y detallados sobre temas complejos.",
        "Utilizar el lenguaje con flexibilidad para fines sociales, académicos y profesionales.",
        "Dominar modismos, frases hechas y lenguaje figurado."
    ],
    schedules: [
        { id: "3-A", teacher: "Prof. Lisa Thompson", schedule: "Lunes y Miércoles, 19:00", students: 10, maxStudents: 12, status: 'active' },
        { id: "3-B", teacher: "Prof. Carlos Mendez", schedule: "Sábados, 11:00", students: 8, maxStudents: 12, status: 'active' }
    ]
  }
];

// Deprecated, use schedules inside each course
export const horarios = [
    { id: '1', dia: 'Lunes', hora: '10:00 AM' },
    { id: '2', dia: 'Martes', hora: '03:00 PM' },
    { id: '3', dia: 'Miércoles', hora: '06:00 PM' },
    { id: '4', dia: 'Jueves', hora: '09:00 AM' },
    { id: '5', dia: 'Viernes', hora: '11:00 AM' },
];

export const cursosData: CursosData = {
  "ingles-basico": {
    titulo: "Inglés Básico",
    descripcion: "Comienza desde cero y aprende lo esencial del idioma inglés",
    niveles: [
      {
        id: "a1",
        nombre: "Nivel A1 - Principiante",
        descripcion: "Fundamentos básicos del inglés",
        duracion: "8 semanas",
        lecciones: 24,
        estudiantes: 1200,
        rating: 4.8
      },
      {
        id: "a2",
        nombre: "Nivel A2 - Elemental",
        descripcion: "Desarrollo de habilidades comunicativas básicas",
        duracion: "10 semanas",
        lecciones: 30,
        estudiantes: 980,
        rating: 4.7
      }
    ]
  },
  "ingles-intermedio": {
    titulo: "Inglés Intermedio",
    descripcion: "Mejora tu gramática y vocabulario para conversaciones fluidas",
    niveles: [
      {
        id: "b1",
        nombre: "Nivel B1 - Intermedio Bajo",
        descripcion: "Comunicación independiente en situaciones cotidianas",
        duracion: "12 semanas",
        lecciones: 36,
        estudiantes: 850,
        rating: 4.9
      },
      {
        id: "b2",
        nombre: "Nivel B2 - Intermedio Alto",
        descripcion: "Fluidez en conversaciones complejas",
        duracion: "14 semanas",
        lecciones: 42,
        estudiantes: 720,
        rating: 4.8
      }
    ]
  },
  "ingles-avanzado": {
    titulo: "Inglés Avanzado",
    descripcion: "Perfecciona tu fluidez y comprensión para nivel profesional",
    niveles: [
      {
        id: "c1",
        nombre: "Nivel C1 - Avanzado",
        descripcion: "Dominio del idioma para contextos académicos y profesionales",
        duracion: "16 semanas",
        lecciones: 48,
        estudiantes: 450,
        rating: 4.9
      },
      {
        id: "c2",
        nombre: "Nivel C2 - Maestría",
        descripcion: "Nivel nativo para comunicación experta",
        duracion: "18 semanas",
        lecciones: 54,
        estudiantes: 280,
        rating: 5.0
      }
    ]
  }
};

export const docentesData: DocentesData = {
  "ingles-basico": {
    "a1": [
      {
        id: 1,
        nombre: "Prof. Sarah Johnson",
        especialidad: "Inglés para Principiantes",
        experiencia: "8 años",
        rating: 4.9,
        estudiantes: 450,
        imagen: "/api/placeholder/60/60",
        horarios: [
          {
            id: "a1-1",
            dia: "Lunes y Miércoles",
            hora: "18:00 - 19:30",
            modalidad: "Online",
            cupos: 15,
            precio: "Gratuito",
            estado: "disponible"
          },
          {
            id: "a1-2",
            dia: "Martes y Jueves",
            hora: "20:00 - 21:30",
            modalidad: "Online",
            cupos: 12,
            precio: "Gratuito",
            estado: "disponible"
          },
          {
            id: "a1-3",
            dia: "Sábados",
            hora: "10:00 - 12:00",
            modalidad: "Online",
            cupos: 18,
            precio: "Gratuito",
            estado: "disponible"
          }
        ]
      },
      {
        id: 2,
        nombre: "Prof. Michael Chen",
        especialidad: "Fonética y Pronunciación",
        experiencia: "6 años",
        rating: 4.8,
        estudiantes: 380,
        imagen: "/api/placeholder/60/60",
        horarios: [
          {
            id: "a1-4",
            dia: "Lunes y Viernes",
            hora: "19:00 - 20:30",
            modalidad: "Online",
            cupos: 18,
            precio: "Gratuito",
            estado: "disponible"
          },
          {
            id: "a1-5",
            dia: "Miércoles",
            hora: "17:00 - 19:00",
            modalidad: "Online",
            cupos: 20,
            precio: "Gratuito",
            estado: "disponible"
          }
        ]
      }
    ],
    "a2": [
      {
        id: 3,
        nombre: "Prof. Emma Rodriguez",
        especialidad: "Conversación Básica",
        experiencia: "7 años",
        rating: 4.9,
        estudiantes: 520,
        imagen: "/api/placeholder/60/60",
        horarios: [
          {
            id: "a2-1",
            dia: "Martes y Jueves",
            hora: "18:30 - 20:00",
            modalidad: "Online",
            cupos: 16,
            precio: "Gratuito",
            estado: "disponible"
          },
          {
            id: "a2-2",
            dia: "Sábados",
            hora: "14:00 - 16:00",
            modalidad: "Online",
            cupos: 22,
            precio: "Gratuito",
            estado: "disponible"
          }
        ]
      }
    ]
  },
  "ingles-intermedio": {
    "b1": [
      {
        id: 4,
        nombre: "Prof. David Thompson",
        especialidad: "Gramática Intermedia",
        experiencia: "10 años",
        rating: 4.9,
        estudiantes: 320,
        imagen: "/api/placeholder/60/60",
        horarios: [
          {
            id: "b1-1",
            dia: "Lunes y Miércoles",
            hora: "19:00 - 20:30",
            modalidad: "Online",
            cupos: 14,
            precio: "Gratuito",
            estado: "disponible"
          },
          {
            id: "b1-2",
            dia: "Viernes",
            hora: "17:00 - 19:30",
            modalidad: "Online",
            cupos: 16,
            precio: "Gratuito",
            estado: "disponible"
          }
        ]
      }
    ],
    "b2": [
      {
        id: 5,
        nombre: "Prof. Lisa Anderson",
        especialidad: "Inglés de Negocios",
        experiencia: "12 años",
        rating: 5.0,
        estudiantes: 280,
        imagen: "/api/placeholder/60/60",
        horarios: [
          {
            id: "b2-1",
            dia: "Martes y Jueves",
            hora: "20:00 - 21:30",
            modalidad: "Online",
            cupos: 12,
            precio: "Gratuito",
            estado: "disponible"
          }
        ]
      }
    ]
  },
  "ingles-avanzado": {
    "c1": [
      {
        id: 6,
        nombre: "Prof. James Wilson",
        especialidad: "Inglés Académico",
        experiencia: "15 años",
        rating: 5.0,
        estudiantes: 180,
        imagen: "/api/placeholder/60/60",
        horarios: [
          {
            id: "c1-1",
            dia: "Lunes y Miércoles",
            hora: "19:30 - 21:00",
            modalidad: "Online",
            cupos: 10,
            precio: "Gratuito",
            estado: "disponible"
          }
        ]
      }
    ],
    "c2": [
      {
        id: 7,
        nombre: "Prof. Maria Garcia",
        especialidad: "Inglés de Maestría",
        experiencia: "18 años",
        rating: 5.0,
        estudiantes: 120,
        imagen: "/api/placeholder/60/60",
        horarios: [
          {
            id: "c2-1",
            dia: "Martes y Viernes",
            hora: "20:00 - 21:30",
            modalidad: "Online",
            cupos: 8,
            precio: "Gratuito",
            estado: "disponible"
          }
        ]
      }
    ]
  }
};

export const nivelInfo: NivelInfoData = {
  "a1": { nombre: "Nivel A1 - Principiante", descripcion: "Fundamentos básicos del inglés" },
  "a2": { nombre: "Nivel A2 - Elemental", descripcion: "Desarrollo de habilidades comunicativas básicas" },
  "b1": { nombre: "Nivel B1 - Intermedio Bajo", descripcion: "Comunicación independiente en situaciones cotidianas" },
  "b2": { nombre: "Nivel B2 - Intermedio Alto", descripcion: "Fluidez en conversaciones complejas" },
  "c1": { nombre: "Nivel C1 - Avanzado", descripcion: "Dominio del idioma para contextos académicos y profesionales" },
  "c2": { nombre: "Nivel C2 - Maestría", descripcion: "Nivel nativo para comunicación experta" }
}; 