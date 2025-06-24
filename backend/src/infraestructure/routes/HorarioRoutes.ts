import { Router } from "express";
import { HorarioController } from "../controller/HorarioController";

const router = Router();
const horarioController = new HorarioController();

router.get("/", async (req, res) => {
  await horarioController.getHorariosByDocente(req, res);
});

router.get("/:id/estudiantes", async (req, res) => {
  await horarioController.getEstudiantesPorHorario(req, res);
});

export default router; 