import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "asistencia", schema: "freenglish" })
export class Asistencia {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "estudiante_id" })
    estudiante_id!: number;

    @Column({ name: "horario_id" })
    horario_id!: number;

    @Column({ name: "fecha", type: "date" })
    fecha!: string;

    @Column({ name: "presente", type: "boolean", default: () => "TRUE" })
    presente!: boolean;
} 