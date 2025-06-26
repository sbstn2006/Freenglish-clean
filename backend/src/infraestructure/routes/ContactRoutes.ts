import { Router } from 'express';
import { ContactController } from '../controller/ContactController';

const router = Router();
const contactController = new ContactController();

// Ruta pública para enviar mensajes de contacto
router.post('/contact', async (req, res) => {
    try {
        await contactController.sendContactEmail(req, res);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al procesar el mensaje de contacto", 
            error 
        });
    }
});

export default router; 