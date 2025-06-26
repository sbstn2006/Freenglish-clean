import { Router } from 'express';
import { InscripcionController } from '../controller/InscripcionController';

const router = Router();
const inscripcionController = new InscripcionController();

router.get('/all-enriched', (req, res) => inscripcionController.getAllInscripcionesEnriched(req, res));

export default router; 