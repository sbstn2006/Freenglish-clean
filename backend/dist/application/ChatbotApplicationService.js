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
exports.ChatbotApplicationService = void 0;
class ChatbotApplicationService {
    constructor(port) {
        this.port = port;
    }
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!message || message.trim().length === 0) {
                    throw new Error("El mensaje no puede estar vacío");
                }
                return yield this.port.sendMessage(message);
            }
            catch (error) {
                console.error("Error in ChatbotApplicationService.sendMessage:", error);
                throw new Error("Failed to process chatbot message");
            }
        });
    }
}
exports.ChatbotApplicationService = ChatbotApplicationService;
//# sourceMappingURL=ChatbotApplicationService.js.map