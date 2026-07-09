import { Request, Response } from "express";
import { ChatbotApplicationService } from "../../application/ChatbotApplicationService";

export class ChatbotController {
    private app: ChatbotApplicationService;

    constructor(app: ChatbotApplicationService) {
        this.app = app;
    }

    async sendMessage(req: Request, res: Response) {
        try {
            const { message } = req.body;

            if (!message || message.trim().length === 0) {
                return res.status(400).json({
                    error: "El mensaje no puede estar vacío"
                });
            }

            const response = await this.app.sendMessage(message);

            return res.status(200).json({
                message: response
            });

        } catch (error) {
            console.error("Error en ChatbotController.sendMessage:", error);

            return res.status(500).json({
                error: "Error al procesar la consulta al asistente IA"
            });
        }
    }
}