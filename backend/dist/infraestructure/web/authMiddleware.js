"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const AuthService_1 = require("../../application/AuthService");
function authenticateToken(req, res, next) {
    const autHeader = req.headers["authorization"];
    const token = autHeader && autHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Token requerido" });
        return;
    }
    try {
        const payload = AuthService_1.AuthService.verifyToken(token);
        req.user = payload;
        next();
    }
    catch (error) {
        res.status(403).json({ error: "Token inválido o ya expiró" });
    }
}
//# sourceMappingURL=authMiddleware.js.map