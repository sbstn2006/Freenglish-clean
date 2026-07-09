"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotController = void 0;
class ChatbotController {
    constructor(app) {
        this.app = app;
    }
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { message } = req.body;
                if (!message || message.trim().length === 0) {
                    return res.status(400).json({
                        error: "El mensaje no puede estar vacío"
                    });
                }
                const response = yield this.app.sendMessage(message);
                return res.status(200).json({
                    message: response
                });
            }
            catch (error) {
                console.error("Error en ChatbotController.sendMessage:", error);
                return res.status(500).json({
                    error: "Error al procesar la consulta al asistente IA"
                });
            }
        });
    }
}
exports.ChatbotController = ChatbotController;
//# sourceMappingURL=ChatbotController.js.map