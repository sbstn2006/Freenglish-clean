import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "usuarios", schema: "freenglish" })
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "nombre", type: "varchar", length: 255 })
    name!: string;

    @Column({ name: "email", type: "varchar", length: 255, unique: true })
    email!: string;

    @Column({ name: "clave", type: "varchar", length: 255 })
    password!: string;

    @Column({ name: "rol", type: "varchar", length: 20 })
    rol!: string;

    @Column({ name: "estado", type: "varchar", length: 20, default: () => "'activo'" })
    status!: string;
}