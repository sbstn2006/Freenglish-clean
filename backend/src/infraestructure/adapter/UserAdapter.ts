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
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            status: user.status
        };
    }
 
    //Transforma el modelo de dominio a la entidad de infraestructura
    private toEntity(user: Omit<UserDomain, "id">): UserEntitie {
        const userEntity = new UserEntitie();
        userEntity.name = user.name;
        userEntity.email = user.email;
        userEntity.password = user.password;
        userEntity.role = user.role;
        userEntity.status = user.status;
        return userEntity;
    }
 
    async createUser(user: Omit<UserDomain, "id">): Promise<number> {
        try {
            const newUser = this.toEntity(user);
            const savedUser = await this.userRepository.save(newUser);
            return savedUser.id;
        } catch (error) {
            console.error("error creating user: ", error);
            throw new Error("failed to create user")
        }
    }
    async updateUser(id: number, user: Partial<UserDomain>): Promise<boolean> {
        try {
            const existingUser = await this.userRepository.findOne({ where: { id: id } });
            if (!existingUser) return false;
            //Actualizar solo los campos enviados
            Object.assign(existingUser, {
                name: user.name ?? existingUser.name,
                email: user.email ?? existingUser.email,
                password: user.password ?? existingUser.password
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
            const existingUser = await this.userRepository.findOne({ where: { id: id }});
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
            const existingUser = await this.userRepository.findOne({ where: { email: email }});
            return existingUser ? this.toDomain(existingUser) : null; // Return null if user not found
        } catch (error) {
            console.error("Error fetching user by mail:", error);
            throw new Error("Failed to fetch user by mail");
        }
    }
 
}