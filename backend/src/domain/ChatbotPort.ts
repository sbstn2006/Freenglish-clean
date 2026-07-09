export interface ChatbotPort {
    sendMessage(message: string): Promise<string>;
}