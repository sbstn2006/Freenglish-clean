import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "horarios", schema: "freenglish" })
export class Horario {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "curso_id" })
    curso_id!: number;

    @Column({ name: "docente_id" })
    docente_id!: number;

    @Column({ name: "dia_semana", type: "varchar", length: 20 })
    dia_semana!: string;

    @Column({ name: "hora_inicio", type: "time" })
    hora_inicio!: string;

    @Column({ name: "hora_fin", type: "time" })
    hora_fin!: string;

    @Column({ name: "max_estudiantes", type: "int" })
    max_estudiantes!: number;

    @Column({ name: "estado", type: "varchar", length: 20, default: () => "'activo'" })
    estado!: string;
} 