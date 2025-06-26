import { Router } from 'express';
import { UserAdapter } from '../adapter/UserAdapter';
import { UserApplicationService } from '../../application/UserApplicationService';
import { UserController } from '../controller/UserController';
import { authenticateToken } from '../web/authMiddleware';

const router = Router();

//Inicialización de las capas
const userAdapter = new UserAdapter();
const userAppService = new UserApplicationService(userAdapter);
const userController = new UserController(userAppService);

// Rutas públicas
router.post('/login', async (req, res) => {
    await userController.login(req, res);
});

router.post('/register', async (req, res) => {
    try {
        await userController.createUser(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la creación del usuario", error });
    }   
});

// Ruta pública para obtener docentes 
router.get('/docentes', async (req, res) => {
    try {
        await userController.getDocentes(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los docentes", error });
    }
});

// Rutas públicas para gestión de docentes
router.put('/docentes/:id/activar', async (req, res) => {
    try {
        await userController.activateDocente(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al activar docente", error });
    }
});

router.put('/docentes/:id/rechazar', async (req, res) => {
    try {
        await userController.rechazarDocente(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al rechazar docente", error });
    }
});

router.put('/docentes/:id/actualizar', async (req, res) => {
    try {
        await userController.updateDocente(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar docente", error });
    }
});

// Rutas protegidas 
router.put('/users/:id', authenticateToken, async (req, res) => {
    try {
        await userController.updateUser(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar al usuario", error });
    }   
});

router.get('/users', async (req, res) => {
    try {
        await userController.getAllUsers(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
});

router.get('/users/:id', authenticateToken, async (req, res) => {
    try {
        await userController.getUserById(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el usuario", error });
    }
});

router.get('/users-mail/:email', authenticateToken, async (req, res) => {
    try {
        await userController.getUserByEmail(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el usuario por email", error });
    }
});

router.delete('/users/:id', authenticateToken, async (req, res) => {
    try {
        await userController.deleteUser(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error al eliminar el usuario", error });
    }
});

// Rutas para gestión de docentes pendientes 
router.get('/pending-docentes', authenticateToken, async (req, res) => {
    try {
        await userController.getPendingDocentes(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener docentes pendientes", error });
    }
});

router.put('/activate-docente/:id', authenticateToken, async (req, res) => {
    try {
        await userController.activateDocente(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al activar docente", error });
    }
});

// Ruta de prueba 
router.get('/test', (req, res) => {
    res.status(200).json({ message: 'API funcionando correctamente' });
});

// Ruta para actividades recientes
router.get('/actividades-recientes', async (req, res) => {
  const { AppDataSource } = require('../config/data-base');
  const ActividadReciente = require('../entities/ActividadReciente').ActividadReciente;
  const User = require('../entities/User').User;
  try {
    const actividades = await AppDataSource.getRepository(ActividadReciente).find({ order: { fecha: 'DESC' } });
    // Obtener ids únicos de usuario
    const usuarioIds = [...new Set(actividades.map((a: any) => a.usuario_id))];
    const usuarios = await AppDataSource.getRepository(User).findByIds(usuarioIds);
    const usuariosMap = Object.fromEntries(usuarios.map((u: any) => [u.id, u]));
    // Enriquecer actividades
    const actividadesEnriquecidas = actividades.map((a: any) => ({
      ...a,
      nombre: usuariosMap[a.usuario_id]?.name || '',
      email: usuariosMap[a.usuario_id]?.email || ''
    }));
    res.json(actividadesEnriquecidas);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener actividades recientes' });
  }
});

export default router;