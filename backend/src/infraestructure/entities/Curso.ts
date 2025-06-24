import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "cursos", schema: "freenglish" })
export class Curso {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "titulo", type: "varchar", length: 255 })
    titulo!: string;

    @Column({ name: "descripcion", type: "text" })
    descripcion!: string;

    @Column({ name: "nivel", type: "varchar", length: 10 })
    nivel!: string;

    @Column({ name: "slug", type: "varchar", length: 100 })
    slug!: string;

    @Column({ name: "duracion", type: "varchar", length: 50 })
    duracion!: string;

    @Column({ name: "estado", type: "varchar", length: 20, default: () => "'activo'" })
    estado!: string;
} 