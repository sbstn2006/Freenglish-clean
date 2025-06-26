export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    rol: string;
    /**
     * Estado del usuario: 'activo' | 'pendiente'.
     * Este campo se mapea a 'estado' en la base de datos.
     */
    status: string;
}