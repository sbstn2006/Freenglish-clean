export interface Horario {
    id: number;
    curso_id: number;
    docente_id: number;
    dia_semana: string;
    hora_inicio: string;
    hora_fin: string;
    max_estudiantes: number;
    estado: string;
} 