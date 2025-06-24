import { Request, Response } from "express";
import { AppDataSource } from "../config/data-base";
import { Horario } from "../entities/Horario";
import { Inscripcion } from "../entities/Inscripcion";
import { User } from "../entities/User";

export class HorarioController {
  async getHorariosByDocente(req: Request, res: Response) {
    try {
      const docenteId = parseInt(req.query.docenteId as string);
      if (isNaN(docenteId)) {
        return res.status(400).json({ error: "docenteId inválido" });
      }
      const horarios = await AppDataSource.getRepository(Horario).find({
        where: { docente_id: docenteId }
      });
      return res.status(200).json(horarios);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los horarios" });
    }
  }

  async getEstudiantesPorHorario(req: Request, res: Response) {
    try {
      const horarioId = parseInt(req.params.id);
      if (isNaN(horarioId)) {
        return res.status(400).json({ error: "horarioId inválido" });
      }
      // Busca inscripciones activas para ese horario
      const inscripciones = await AppDataSource.getRepository(Inscripcion).find({
        where: { horario_id: horarioId, estado: "activa" }
      });
      // Busca los usuarios (estudiantes) de esas inscripciones
      const estudianteIds = inscripciones.map(i => i.estudiante_id);
      if (estudianteIds.length === 0) return res.json([]);
      const estudiantes = await AppDataSource.getRepository(User).findByIds(estudianteIds);
      return res.json(estudiantes);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los estudiantes" });
    }
  }
} 