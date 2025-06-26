import { Router } from 'express';
import { UserAdapter } from '../adapter/UserAdapter';
import { UserApplicationService } from '../../application/UserApplicationService';
import { UserController } from '../controller/UserController';

const router = Router();

//Inicialización de las capas
const userAdapter = new UserAdapter();
const userAppService = new UserApplicationService(userAdapter);
const userController = new UserController(userAppService);

// Rutas de autenticación (públicas)
router.post('/login', async (req, res) => {
    await userController.login(req, res);
});

router.post('/registro', async (req, res) => {
    try {
        await userController.createUser(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la creación del usuario", error });
    }   
});

// Ruta de prueba
router.get('/test', (req, res) => {
    res.status(200).json({ message: 'API funcionando correctamente' });
});

export default router; 