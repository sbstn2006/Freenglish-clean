export interface Horario {
  id: string;
  dia: string;
  hora: string;
  modalidad: "Online" | "Presencial";
  cupos: number;
  precio: string;
  estado: "disponible" | "lleno";
}

export interface Docente {
  id: number;
  nombre: string;
  especialidad: string;
  experiencia: string;
  rating: number;
  estudiantes: number;
  imagen: string;
  horarios: Horario[];
}

export interface Nivel {
  id: string;
  nombre: string;
  descripcion: string;
  duracion: string;
  lecciones: number;
  estudiantes: number;
  rating: number;
}

export interface Curso {
  titulo: string;
  descripcion: string;
  niveles: Nivel[];
}

export interface NivelInfo {
  nombre: string;
  descripcion: string;
}

export type CursosData = {
  [cursoId: string]: Curso;
};

export type DocentesData = {
  [cursoId: string]: {
    [nivelId: string]: Docente[];
  };
};

export type NivelInfoData = {
  [nivelId: string]: NivelInfo;
}; 