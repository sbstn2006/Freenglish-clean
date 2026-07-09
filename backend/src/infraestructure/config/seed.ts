import { AppDataSource } from "./data-base";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";

export const createDefaultAdmin = async () => {
    const userRepository = AppDataSource.getRepository(User);

    const adminExists = await userRepository.findOne({
        where: {
            email: "admin@freenglish.com"
        }
    });

    if (!adminExists) {
        const passwordHash = await bcrypt.hash("Admin123*", 10);

        const admin = userRepository.create({
            name: "Administrador",
            email: "admin@freenglish.com",
            password: passwordHash,
            rol: "admin",
            status: "activo"
        });

        await userRepository.save(admin);

        console.log("Usuario admin creado");
    } else {
        console.log("Usuario admin ya existe");
    }
};