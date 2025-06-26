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
    async login(email:string, password:string):Promise<{user: User, token: string} | null>{
        const existingUser = await this.port.getUserByEmail(email);

        if(!existingUser){
            return null;
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if(!passwordMatch){
            return null;
        }

        // Verificar si el usuario está activo
        if (existingUser.status === 'pending') {
            throw new Error('Tu cuenta está pendiente de aprobación por el administrador. Recibirás una notificación cuando sea aprobada.');
        }

        // Generar token JWT
        const token = AuthService.generateToken({
            id: existingUser.id,
            email: existingUser.email,
            rol: existingUser.rol
        });

        return {
            user: existingUser,
            token: token
        };
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

    async activateDocente(id: number): Promise<boolean> {
        const existingUser = await this.port.getUserById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }
        
        if (existingUser.rol !== 'docente') {
            throw new Error('User is not a docente');
        }
        
        if (existingUser.status === 'activo') {
            return false; // Ya está activo
        }
        
        return await this.port.updateUser(id, { status: 'activo' });
    }

    async getPendingDocentes(): Promise<User[]> {
        const allUsers = await this.port.getAllUsers();
        return allUsers.filter(user => user.rol === 'docente' && user.status === 'pendiente');
    }
}