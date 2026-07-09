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
const UserAdapter_1 = require("../adapter/UserAdapter");
const UserApplicationService_1 = require("../../application/UserApplicationService");
const UserController_1 = require("../controller/UserController");
const router = (0, express_1.Router)();
const userAdapter = new UserAdapter_1.UserAdapter();
const userAppService = new UserApplicationService_1.UserApplicationService(userAdapter);
const userController = new UserController_1.UserController(userAppService);
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userController.login(req, res);
}));
router.post('/registro', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.createUser(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error en la creación del usuario", error });
    }
}));
router.get('/test', (req, res) => {
    res.status(200).json({ message: 'API funcionando correctamente' });
});
exports.default = router;
//# sourceMappingURL=AuthRoutes.js.map