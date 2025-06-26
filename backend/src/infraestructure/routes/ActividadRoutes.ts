import { Router } from 'express';
import { ActividadAdapter } from '../adapter/ActividadAdapter';
import { ActividadApplicationService } from '../../application/ActividadApplicationService';
import { ActividadController } from '../controller/ActividadController';
import { authenticateToken } from '../web/authMiddleware';

const router = Router();

//Inicialización de las capas
const actividadAdapter = new ActividadAdapter();
const actividadAppService = new ActividadApplicationService(actividadAdapter);
const actividadController = new ActividadController(actividadAppService);

//Definir las rutas con el manejo de errores

router.post('/actividades', authenticateToken, async (req, res) => {
    try {
        await actividadController.createActividad(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la creación de la actividad", error });
    }   
});

router.put('/actividades/:id', authenticateToken, async (req, res) => {
    try {
        await actividadController.updateActividad(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la actividad", error });
    }   
});

router.get('/actividades', async (req, res) => {
    try {
        await actividadController.getAllActividades(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las actividades", error });
    }
});

router.get('/actividades/:id', authenticateToken, async (req, res) => {
    try {
        await actividadController.getActividadById(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la actividad", error });
    }
});

router.get('/actividades-recientes', async (req, res) => {
    try {
        await actividadController.getActividadesRecientes(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las actividades recientes", error });
    }
});

router.get('/actividades-usuario/:usuarioId', authenticateToken, async (req, res) => {
    try {
        await actividadController.getActividadesByUsuario(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las actividades del usuario", error });
    }
});

router.delete('/actividades/:id', authenticateToken, async (req, res) => {
    try {
        await actividadController.deleteActividad(req, res);
    } catch (error) {
        res.status(400).json({ message: "Error al eliminar la actividad", error });
    }
});

export default router; 