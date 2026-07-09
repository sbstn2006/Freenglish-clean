import { ChatbotPort } from "../domain/ChatbotPort";

export class ChatbotApplicationService {
    private port: ChatbotPort;

    constructor(port: ChatbotPort) {
        this.port = port;
    }

    async sendMessage(message: string): Promise<string> {
        try {
            if (!message || message.trim().length === 0) {
                throw new Error("El mensaje no puede estar vacío");
            }

            return await this.port.sendMessage(message);
        } catch (error) {
            console.error("Error in ChatbotApplicationService.sendMessage:", error);
            throw new Error("Failed to process chatbot message");
        }
    }
}