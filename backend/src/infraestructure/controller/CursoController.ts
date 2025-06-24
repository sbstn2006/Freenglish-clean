import { Request, Response } from "express";
import { CursoApplicationService } from "../../application/CursoApplicationService";
import { Curso } from "../../domain/Curso";

export class CursoController {
    private app: CursoApplicationService;

    constructor(app: CursoApplicationService) {
        this.app = app;
    }

    async createCurso(req: Request, res: Response) {
        try {
            const { titulo, descripcion, nivel, slug, duracion } = req.body;

            // Validaciones
            if (!titulo || titulo.trim().length < 3) {
                return res.status(400).json({ error: "El título debe tener al menos 3 caracteres" });
            }

            if (!descripcion || descripcion.trim().length < 10) {
                return res.status(400).json({ error: "La descripción debe tener al menos 10 caracteres" });
            }

            if (!nivel || !['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(nivel)) {
                return res.status(400).json({ error: "Nivel debe ser A1, A2, B1, B2, C1 o C2" });
            }

            if (!slug || slug.trim().length < 3) {
                return res.status(400).json({ error: "El slug debe tener al menos 3 caracteres" });
            }

            if (!duracion || duracion.trim().length < 2) {
                return res.status(400).json({ error: "La duración debe tener al menos 2 caracteres" });
            }

            const curso: Omit<Curso, "id"> = {
                titulo: titulo.trim(),
                descripcion: descripcion.trim(),
                nivel,
                slug: slug.trim(),
                duracion: duracion.trim(),
                estado: "activo"
            };

            const cursoId = await this.app.createCurso(curso);

            return res.status(201).json({ 
                message: "Curso creado con éxito", 
                cursoId 
            });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error interno del servidor",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getCursoById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
            }

            const curso = await this.app.getCursoById(id);
            if (!curso) {
                return res.status(404).json({ error: "Curso no encontrado" });
            }

            return res.status(200).json(curso);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error interno del servidor",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getAllCursos(req: Request, res: Response) {
        try {
            const cursos = await this.app.getAllCursos();
            return res.status(200).json(cursos);
        } catch (error) {
            return res.status(500).json({ error: "Error al obtener los cursos" });
        }
    }

    async getCursosByNivel(req: Request, res: Response) {
        try {
            const { nivel } = req.params;
            
            if (!nivel || !['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(nivel)) {
                return res.status(400).json({ error: "Nivel debe ser A1, A2, B1, B2, C1 o C2" });
            }

            const cursos = await this.app.getCursosByNivel(nivel);
            return res.status(200).json(cursos);
        } catch (error) {
            return res.status(500).json({ error: "Error al obtener los cursos por nivel" });
        }
    }

    async updateCurso(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
            }

            const { titulo, descripcion, nivel, slug, duracion, estado } = req.body;

            // Validaciones para campos opcionales
            if (titulo && titulo.trim().length < 3) {
                return res.status(400).json({ error: "El título debe tener al menos 3 caracteres" });
            }

            if (descripcion && descripcion.trim().length < 10) {
                return res.status(400).json({ error: "La descripción debe tener al menos 10 caracteres" });
            }

            if (nivel && !['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(nivel)) {
                return res.status(400).json({ error: "Nivel debe ser A1, A2, B1, B2, C1 o C2" });
            }

            if (slug && slug.trim().length < 3) {
                return res.status(400).json({ error: "El slug debe tener al menos 3 caracteres" });
            }

            if (duracion && duracion.trim().length < 2) {
                return res.status(400).json({ error: "La duración debe tener al menos 2 caracteres" });
            }

            const updated = await this.app.updateCurso(id, {
                titulo: titulo?.trim(),
                descripcion: descripcion?.trim(),
                nivel,
                slug: slug?.trim(),
                duracion: duracion?.trim(),
                estado
            });

            if (!updated) {
                return res.status(404).json({ error: "Curso no encontrado o sin cambios" });
            }

            return res.status(200).json({ message: "Curso actualizado con éxito" });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error interno del servidor",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async deleteCurso(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
            }

            const deleted = await this.app.deleteCurso(id);
            if (!deleted) {
                return res.status(404).json({ error: "Curso no encontrado" });
            }

            return res.status(200).json({ message: "Curso eliminado con éxito" });
        } catch (error) {
            return res.status(500).json({ error: "Error al eliminar el curso" });
        }
    }
} 