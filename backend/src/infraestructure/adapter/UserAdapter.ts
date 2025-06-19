import { UserPort } from "../../domain/UserPort";
import { User as UserEntitie } from "../entities/User";
import { User as UserDomain} from "../../domain/User";
import { AppDataSource } from "../config/data-base";
import { Repository } from "typeorm";
 
export class UserAdapter implements UserPort {
    private userRepository: Repository<UserEntitie>;
    constructor() {
        this.userRepository = AppDataSource.getRepository(UserEntitie);
    }
 
    //Transforma la entidad de infraestructura(entidad User.ts) al modelo de dominio (interface User.ts)
    private toDomain(user: UserEntitie): UserDomain {
        return {
            id: user.id_user,
            name: user.name_user,
            email: user.email_user,
            password: user.password_user
        };
    }
 
    //Transforma el modelo de dominio a la entidad de infraestructura
    private toEntity(user: Omit<UserDomain, "id">): UserEntitie {
        const userEntity = new UserEntitie();
        userEntity.name_user = user.name;
        userEntity.email_user = user.email;
        userEntity.password_user = user.password;
        return userEntity;
    }
 
    async createUser(user: Omit<UserDomain, "id">): Promise<number> {
        try {
            const newUser = this.toEntity(user);
            const savedUser = await this.userRepository.save(newUser);
            return savedUser.id_user;
        } catch (error) {
            console.error("error creating user: ", error);
            throw new Error("failed to create user")
        }
    }
    async updateUser(id: number, user: Partial<UserDomain>): Promise<boolean> {
        try {
            const existingUser = await this.userRepository.findOne({ where: { id_user: id } });
            if (!existingUser) return false;
            //Actualizar solo los campos enviados
            Object.assign(existingUser, {
                name_user: user.name ?? existingUser.name_user,
                email_user: user.email ?? existingUser.email_user,
                password_user: user.password ?? existingUser.password_user
            });
            await this.userRepository.save(existingUser);
            return true;
        } catch (error) {
            console.error("Error updating user:", error);
            throw new Error("Failed to update user");
 
        }
    }
    async deleteUser(id: number): Promise<boolean> {
       try {
        const result = await this.userRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
       } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user");
       }
    }
    async getUserById(id: number): Promise<UserDomain | null> {
        try {
            const existingUser = await this.userRepository.findOne({ where: { id_user: id }});
            return existingUser ? this.toDomain(existingUser) : null; // Return null if user not found
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            throw new Error("Failed to fetch user by ID");
        }
    }
    async getAllUsers(): Promise<UserDomain[]> {
        try {
            const users = await this.userRepository.find();
            return users.map(user => this.toDomain(user)); // Convert each user entity to domain
        } catch (error) {
            console.error("Error fetching all users:", error);
            throw new Error("Failed to fetch all users");           
        }
    }
    async getUserByEmail(email: string): Promise<UserDomain | null> {
        try {
            const existingUser = await this.userRepository.findOne({ where: { email_user: email }});
            return existingUser ? this.toDomain(existingUser) : null; // Return null if user not found
        } catch (error) {
            console.error("Error fetching user by mail:", error);
            throw new Error("Failed to fetch user by mail");
        }
    }
 
}