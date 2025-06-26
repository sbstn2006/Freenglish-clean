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
const ContactController_1 = require("../controller/ContactController");
const router = (0, express_1.Router)();
const contactController = new ContactController_1.ContactController();
// Ruta pública para enviar mensajes de contacto
router.post('/contact', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield contactController.sendContactEmail(req, res);
    }
    catch (error) {
        res.status(500).json({
            message: "Error al procesar el mensaje de contacto",
            error
        });
    }
}));
exports.default = router;
//# sourceMappingURL=ContactRoutes.js.map