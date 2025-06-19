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

// Rutas públicas (sin autenticación)
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

// Rutas protegidas (con autenticación)
router.put('/users/:id', authenticateToken, async (req, res) => {
    try {
        await userController.updateUser(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar al usuario", error });
    }   
});

router.get('/users', authenticateToken, async (req, res) => {
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

// Ruta de prueba
router.get('/test', (req, res) => {
    res.status(200).json({ message: 'API funcionando correctamente' });
});

export default router;