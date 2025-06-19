import { User } from '../domain/User'
import { UserPort } from '../domain/UserPort';
import bcrypt from 'bcryptjs'
import { AuthService } from './AuthService';

export class UserApplicationService {
    //1. Declaración de propiedades
    private port: UserPort;
    //2. Constructor
    constructor(port: UserPort) {
        this.port = port;
    }
    //3. Métodos -> Casos de uso -> Lógica de negocio
    async login(email:string, password:string):Promise<string>{
        const existingUser = await this.port.getUserByEmail(email);

        if(!existingUser){
            throw new Error ("Credenciales inválidas");
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if(!passwordMatch){
            throw new Error("Credenciales inválidas");
        }

        const token = AuthService.generateToken({
            id: existingUser.id,
            email: existingUser.email,
        });

        return token;
        
    }

    async createUser(user: Omit<User, "id">): Promise<number> {
        const existingUser = await this.port.getUserByEmail(user.email);
        if(!existingUser){
            const hashePassword = await bcrypt.hash(user.password,10);
            user.password = hashePassword;
            return await this.port.createUser(user);
        }
        throw new Error("User with this email already exists")
    }
    async updateUser(id: number, user: Partial<User>): Promise<boolean> {
        const existingUser = await this.port.getUserById(id);
        if(!existingUser){
            throw new Error('User not found');
        }
        if(user.email){
            const emailTaken = await this.port.getUserByEmail(user.email);
            if (emailTaken && emailTaken.id !== id) {
                throw new Error('Email is already taken by another user')
            }
        }
        return await this.port.updateUser(id, user);
    }
    async deleteUser(id: number): Promise<boolean>{
        return await this.port.deleteUser(id);
    }
    async getAllUsers(): Promise<User[]> {
        return await this.port.getAllUsers();
    }
    async getUserById(id: number): Promise<User | null> {
        return await this.port.getUserById(id);
    }
    async getUserByEmail(email: string): Promise<User | null> {
        return await this.port.getUserByEmail(email);
    }
}