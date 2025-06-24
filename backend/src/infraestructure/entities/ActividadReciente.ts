import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "actividad_reciente", schema: "freenglish" })
export class ActividadReciente {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "usuario_id" })
    usuario_id!: number;

    @Column({ name: "accion", type: "text" })
    accion!: string;

    @Column({ name: "fecha", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    fecha!: Date;
} 