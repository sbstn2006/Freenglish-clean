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

// Rutas para gestión de estudiantes (solo admin)
router.get('/estudiantes', authenticateToken, async (req, res) => {
    try {
        await userController.getAllUsers(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los estudiantes", error });
    }
});

router.get('/estudiantes/:id', authenticateToken, async (req, res) => {
    try {
        await userController.getUserById(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el estudiante", error });
    }
});

router.put('/estudiantes/:id', authenticateToken, async (req, res) => {
    try {
        await userController.updateUser(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el estudiante", error });
    }   
});

router.delete('/estudiantes/:id', authenticateToken, async (req, res) => {
    try {
        await userController.deleteUser(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error al eliminar el estudiante", error });
    }
});

export default router; 