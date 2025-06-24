import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Curso } from "../entities/Curso";
import { Horario } from "../entities/Horario";
import { Inscripcion } from "../entities/Inscripcion";
import { Asistencia } from "../entities/Asistencia";
import { ActividadReciente } from "../entities/ActividadReciente";
import envs from "./environment-vars";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: envs.DB_HOST,
    port: envs.DB_PORT,
    username: envs.DB_USER,
    password: envs.DB_PASSWORD,
    database: "freenglish_db",
    schema: envs.DB_SCHEMA,
    synchronize: true,
    logging: true,
    entities: [User, Curso, Horario, Inscripcion, Asistencia, ActividadReciente]
});

//Conectar a la base de datos
export const connectDB = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1); 
    }
};