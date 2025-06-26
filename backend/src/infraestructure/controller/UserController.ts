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

      const result = await this.app.login(email,password);
      if (result) {
        // Bloquear login de docentes pendientes
        if (result.user.rol === 'docente' && result.user.status === 'pendiente') {
          return res.status(401).json({ error: 'Tu cuenta está pendiente de aprobación por el administrador. Recibirás una notificación cuando sea aprobada.' });
        }
        return res.status(200).json({
          message: "Login Exitoso", 
          user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            rol: result.user.rol,
            status: result.user.status
          },
          token: result.token
        });
      } else {
        return res.status(401).json({error: "Error en credenciales"});
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('pendiente')) {
        return res.status(401).json({error: error.message});
      }
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
        rol: role as 'estudiante' | 'docente' | 'admin', 
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
    // Permitir acceso a cualquier usuario autenticado
    try {
      const id = parseInt(req.params.id);
      if(isNaN(id)) return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
      const userData = await this.app.getUserById(id);
      if (!userData) return res.status(404).json({ error: "Usuario no encontrado" });
      return res.status(200).json(userData);
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
    // Permitir acceso a cualquier usuario autenticado
    try {
      const users = await this.app.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  }

  async deleteUser(req: Request, res: Response) {
    // Permitir acceso a cualquier usuario autenticado
    try {
      const id = parseInt(req.params.id);
      if(isNaN(id)) return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
      const deleted = await this.app.deleteUser(id);
      if (!deleted) return res.status(404).json({ error: "Usuario no encontrado" });
      await require('../config/data-base').AppDataSource.getRepository(require('../entities/ActividadReciente').ActividadReciente).save({
        usuario_id: id,
        accion: `Usuario eliminado por el admin`,
        fecha: new Date()
      });
      return res.status(200).json({ message: "Usuario eliminado con éxito" });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar el usuario" });
    }
  }

  async updateUser(req: Request, res: Response) {
    // Permitir acceso a cualquier usuario autenticado
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

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (password !== undefined) updateData.password = password;

      const updated = await this.app.updateUser(id, updateData);
      if (!updated) return res.status(404).json({ error: "Usuario no encontrado o sin cambios" });
      await require('../config/data-base').AppDataSource.getRepository(require('../entities/ActividadReciente').ActividadReciente).save({
        usuario_id: id,
        accion: `Usuario editado por el admin`,
        fecha: new Date()
      });
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

  async activateDocente(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if(isNaN(id)) return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
      const activated = await this.app.activateDocente(id);
      if (!activated) return res.status(404).json({ error: "Docente no encontrado" });
      // Enviar correo de notificación de activación
      try {
        const user = await this.app.getUserById(id);
        if (user && user.email) {
          const { sendMail } = require('../adapter/MailService');
          await sendMail({
            to: user.email,
            subject: 'Tu cuenta de docente ha sido activada',
            text: `Hola ${user.name}, tu cuenta de docente ha sido activada. Ya puedes iniciar sesión y comenzar a usar la plataforma.`
          });
        }
      } catch (mailError) {
        console.error('Error enviando correo de activación:', mailError);
      }
      // Registrar actividad
      await require('../config/data-base').AppDataSource.getRepository(require('../entities/ActividadReciente').ActividadReciente).save({
        usuario_id: id,
        accion: `Docente aceptado por el admin`,
        fecha: new Date()
      });
      return res.status(200).json({ message: "Docente activado con éxito" });
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

  async getPendingDocentes(req: Request, res: Response) {
    try {
      const pendingDocentes = await this.app.getPendingDocentes();
      return res.status(200).json(pendingDocentes);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los docentes pendientes" });
    }
  }

  async getDocentes(req: Request, res: Response) {
    try {
      const allUsers = await this.app.getAllUsers();
      const docentes = allUsers.filter(user => user.rol === 'docente');

      // Importar aquí para evitar problemas circulares
      const { AppDataSource } = require('../config/data-base');
      const Horario = require('../entities/Horario').Horario;
      const Inscripcion = require('../entities/Inscripcion').Inscripcion;
      const { In } = require('typeorm');

      // Enriquecer cada docente con cursos y estudiantes
      const docentesEnriquecidos = await Promise.all(docentes.map(async (docente) => {
        // Cursos (horarios) donde es docente
        const horarios = await AppDataSource.getRepository(Horario).find({ where: { docente_id: docente.id } });
        const cursosCount = horarios.length;

        // IDs de horarios
        const horarioIds = horarios.map((h: any) => h.id);
        let estudiantesCount = 0;
        if (horarioIds.length > 0) {
          estudiantesCount = await AppDataSource.getRepository(Inscripcion)
            .count({ where: { horario_id: In(horarioIds) } });
        }

        return {
          ...docente,
          courses: cursosCount,
          students: estudiantesCount
        };
      }));

      return res.status(200).json(docentesEnriquecidos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al obtener los docentes" });
    }
  }

  async rechazarDocente(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if(isNaN(id)) return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
      const updated = await this.app.updateUser(id, { status: 'rejected' });
      if (!updated) return res.status(404).json({ error: "Docente no encontrado" });
      // Enviar correo de notificación de rechazo
      try {
        const user = await this.app.getUserById(id);
        if (user && user.email) {
          const { sendMail } = require('../adapter/MailService');
          await sendMail({
            to: user.email,
            subject: 'Tu cuenta de docente ha sido rechazada',
            text: `Hola ${user.name}, lamentamos informarte que tu cuenta de docente ha sido rechazada. Si tienes dudas, puedes contactar al administrador.`
          });
        }
      } catch (mailError) {
        console.error('Error enviando correo de rechazo:', mailError);
      }
      // Registrar actividad
      await require('../config/data-base').AppDataSource.getRepository(require('../entities/ActividadReciente').ActividadReciente).save({
        usuario_id: id,
        accion: `Docente rechazado por el admin`,
        fecha: new Date()
      });
      return res.status(200).json({ message: "Docente rechazado con éxito" });
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

  async updateDocente(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if(isNaN(id)) return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
      let { name, email, status } = req.body;
   
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

      const updated = await this.app.updateUser(id, {
        name,
        email,
        status
      });
      if (!updated) return res.status(404).json({ error: "Docente no encontrado o sin cambios" });
   
      return res.status(200).json({ message: "Docente actualizado con éxito" });
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

  async getAllDocentes(req: Request, res: Response) {
    try {
      const allUsers = await this.app.getAllUsers();
      const docentes = allUsers.filter(user => user.rol === 'docente');
      return res.status(200).json(docentes);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los docentes" });
    }
  }

  async getDocenteById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if(isNaN(id)) return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
      const user = await this.app.getUserById(id);
      if (!user || user.rol !== 'docente') return res.status(404).json({ error: "Docente no encontrado" });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener el docente" });
    }
  }

  async createDocente(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      // Validaciones
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
      }
      const user: Omit<User, "id"> = {
        name,
        email,
        password,
        rol: 'docente',
        status: 'pendiente'
      };
      const userId = await this.app.createUser(user);
      return res.status(201).json({ message: "Docente creado con éxito", userId });
    } catch (error) {
      return res.status(500).json({ error: "Error al crear el docente" });
    }
  }

  async deleteDocente(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if(isNaN(id)) return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
      const user = await this.app.getUserById(id);
      if (!user || user.rol !== 'docente') return res.status(404).json({ error: "Docente no encontrado" });
      const deleted = await this.app.deleteUser(id);
      if (!deleted) return res.status(404).json({ error: "Docente no encontrado" });
      return res.status(200).json({ message: "Docente eliminado con éxito" });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar el docente" });
    }
  }
} 