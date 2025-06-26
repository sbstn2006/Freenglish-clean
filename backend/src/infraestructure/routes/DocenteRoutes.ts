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

// Rutas públicas para obtener docentes (sin autenticación)
router.get('/docentes', async (req, res) => {
    try {
        await userController.getDocentes(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los docentes", error });
    }
});

// Rutas para gestión de docentes (solo admin)
router.get('/docentes-pendientes', authenticateToken, async (req, res) => {
    try {
        await userController.getPendingDocentes(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener docentes pendientes", error });
    }
});

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

export default router; 