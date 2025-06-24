import { UserApplicationService } from "../../application/UserApplicationService";
import { Request, Response } from "express";
import { User } from "../../domain/User";

export class UserController{
  private app: UserApplicationService;

  constructor(app: UserApplicationService) {
      this.app = app;
  }

  async login(req: Request, res: Response):Promise<string | Response>{
    try {
      const {email,password} = req.body;

      if(!email || !password){
        return res.status(400).json({error: "Error en email y contraseña"});
      }

      const user = await this.app.login(email,password);
      if (user) {
        return res.status(200).json({
          message: "Login Exitoso", 
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
          }
        });
      } else {
        return res.status(401).json({error: "Error en credenciales"});
      }
    } catch (error) {
      return res.status(401).json({error: "Error en credenciales"});
    }
  }
  async createUser(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;
 
    // Validaciones con expresiones regulares
    if (!/^[A-Za-z\s]{3,}$/.test(name.trim()))
      return res
        .status(400)
        .json({
          error:
            "El nombre debe tener al menos 3 caracteres y solo contener letras",
        });
 
    if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email.trim()))
      return res.status(400).json({ error: "Correo electrónico no válido" });
 
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password.trim()))
      return res
        .status(400)
        .json({
          error:
            "La contraseña debe tener al menos 6 caracteres, incluyendo al menos una letra y un número",
        });

    // Validar rol
    if (!role || !['estudiante', 'docente', 'admin'].includes(role)) {
      return res.status(400).json({ error: "Rol debe ser 'estudiante', 'docente' o 'admin'" });
    }
 
    // Crear usuario con rol y estado apropiado
    const user: Omit<User, "id"> = { 
      name, 
      email, 
      password, 
      role: role as 'estudiante' | 'docente' | 'admin', 
      status: role === 'docente' ? 'pendiente' : 'activo' 
    };
    const userId = await this.app.createUser(user);
 
    return res
      .status(201)
      .json({ message: "Usuario creado con éxito", userId });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({
          error: "Error interno del servidor",
          details: error.message,
        });
    }
    return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  async getUserById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if(isNaN(id)) return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
      const user = await this.app.getUserById(id);
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
      return res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(500)
          .json({
            error: "Error interno del servidor",
            details: error.message,
          });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }     
  }
  async getUserByEmail(req: Request, res: Response) {
    try {
      const {email} = req.params;
      if (!/^[^\s@]+@[^\s@+]+\.[^\s@+]+$/.test(email)) 
        return res.status(400).json({ error: "Correo electrónico no válido" });   
      //Validación de email exitosa procedemos a buscar el usuario por email
      const user = await this.app.getUserByEmail(email);
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
      return res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(500)
          .json({
            error: "Error interno del servidor",
            details: error.message,
          });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.app.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  }
  async deleteUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if(isNaN(id)) return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
      const deleted = await this.app.deleteUser(id);
      if (!deleted) return res.status(404).json({ error: "Usuario no encontrado" });
      return res.status(200).json({ message: "Usuario eliminado con éxito" });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar el usuario" });
    }
  }
  async updateUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if(isNaN(id)) return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
      let { name, email, password } = req.body;
 
      // Validaciones con expresiones regulares
      if (name && !/^[A-Za-z\s]{3,}$/.test(name.trim()))
        return res
          .status(400)
          .json({
            error:
              "El nombre debe tener al menos 3 caracteres y solo contener letras",
          });
 
      if (email && !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email.trim()))
        return res.status(400).json({ error: "Correo electrónico no válido" });
 
      if (password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password.trim()))
        return res
          .status(400)
          .json({
            error:
              "La contraseña debe tener al menos 6 caracteres, incluyendo al menos una letra y un número",
          });

      const updated = await this.app.updateUser(id, {
        name,
        email,
        password
      });
      if (!updated) return res.status(404).json({ error: "Usuario no encontrado o sin cambios" });
 
      return res.status(200).json({ message: "Usuario actualizado con éxito" });
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(500)
          .json({
            error: "Error interno del servidor",
            details: error.message,
          });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}