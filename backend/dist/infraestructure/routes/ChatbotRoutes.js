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
const express_1 = require("express");
const ChatbotController_1 = require("../controller/ChatbotController");
const ChatbotApplicationService_1 = require("../../application/ChatbotApplicationService");
const AIAdapter_1 = require("../adapter/AIAdapter");
const router = (0, express_1.Router)();
const aiAdapter = new AIAdapter_1.AIAdapter();
const chatbotApplicationService = new ChatbotApplicationService_1.ChatbotApplicationService(aiAdapter);
const chatbotController = new ChatbotController_1.ChatbotController(chatbotApplicationService);
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield chatbotController.sendMessage(req, res);
    }
    catch (error) {
        res.status(500).json({
            message: "Error al procesar la consulta del chatbot",
            error
        });
    }
}));
exports.default = router;
//# sourceMappingURL=ChatbotRoutes.js.map