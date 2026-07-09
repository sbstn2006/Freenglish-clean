import { Router } from "express";
import { ChatbotController } from "../controller/ChatbotController";
import { ChatbotApplicationService } from "../../application/ChatbotApplicationService";
import { AIAdapter } from "../adapter/AIAdapter";

const router = Router();

const aiAdapter = new AIAdapter();
const chatbotApplicationService = new ChatbotApplicationService(aiAdapter);
const chatbotController = new ChatbotController(chatbotApplicationService);

router.post("/", async (req, res) => {
    try {
        await chatbotController.sendMessage(req, res);
    } catch (error) {
        res.status(500).json({
            message: "Error al procesar la consulta del chatbot",
            error
        });
    }
});

export default router;