import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-base';
import { InscripcionAdapter } from '../adapter/InscripcionAdapter';
import { InscripcionApplicationService } from '../../application/InscripcionApplicationService';

const inscripcionAdapter = new InscripcionAdapter();
const inscripcionAppService = new InscripcionApplicationService(inscripcionAdapter);

export class InscripcionController {
  async getAllInscripciones(req: Request, res: Response) {
    try {
      const inscripciones = await inscripcionAppService.getAllInscripciones();
      res.json(inscripciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener inscripciones' });
    }
  }

  async getInscripcionById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
      const inscripcion = await inscripcionAppService.getInscripcionById(id);
      if (!inscripcion) return res.status(404).json({ error: 'Inscripción no encontrada' });
      res.json(inscripcion);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la inscripción' });
    }
  }

  async createInscripcion(req: Request, res: Response) {
    try {
      const { estudiante_id, horario_id, fecha_inscripcion, estado } = req.body;
      const inscripcion = { estudiante_id, horario_id, fecha_inscripcion, estado };
      const id = await inscripcionAppService.createInscripcion(inscripcion);
      res.status(201).json({ message: 'Inscripción creada', id });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la inscripción', details: error instanceof Error ? error.message : error });
    }
  }

  async updateInscripcion(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
      const updated = await inscripcionAppService.updateInscripcion(id, req.body);
      if (!updated) return res.status(404).json({ error: 'Inscripción no encontrada o sin cambios' });
      res.json({ message: 'Inscripción actualizada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la inscripción', details: error instanceof Error ? error.message : error });
    }
  }

  async deleteInscripcion(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
      const deleted = await inscripcionAppService.deleteInscripcion(id);
      if (!deleted) return res.status(404).json({ error: 'Inscripción no encontrada' });
      res.json({ message: 'Inscripción eliminada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la inscripción', details: error instanceof Error ? error.message : error });
    }
  }

  async getAllInscripcionesEnriched(req: Request, res: Response) {
    try {
      const result = await AppDataSource.query(`
        SELECT
          i.id AS inscripcion_id,
          i.fecha_inscripcion,
          e.id AS estudiante_id,
          e.nombre AS estudiante_nombre,
          e.email AS estudiante_email,
          c.id AS curso_id,
          c.titulo AS curso_titulo,
          d.id AS docente_id,
          d.nombre AS docente_nombre,
          d.email AS docente_email
        FROM freenglish.inscripciones i
        JOIN freenglish.usuarios e ON i.estudiante_id = e.id
        JOIN freenglish.horarios h ON i.horario_id = h.id
        JOIN freenglish.cursos c ON h.curso_id = c.id
        JOIN freenglish.usuarios d ON h.docente_id = d.id
        ORDER BY i.fecha_inscripcion DESC
      `);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener inscripciones' });
    }
  }
} 