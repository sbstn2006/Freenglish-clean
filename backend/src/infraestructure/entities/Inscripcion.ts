import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "inscripciones", schema: "freenglish" })
export class Inscripcion {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "estudiante_id" })
    estudiante_id!: number;

    @Column({ name: "horario_id" })
    horario_id!: number;

    @Column({ name: "fecha_inscripcion", type: "date", default: () => "CURRENT_DATE" })
    fecha_inscripcion!: string;

    @Column({ name: "estado", type: "varchar", length: 20, default: () => "'activa'" })
    estado!: string;
} 