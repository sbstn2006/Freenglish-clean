"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const InscripcionController_1 = require("../controller/InscripcionController");
const router = (0, express_1.Router)();
const inscripcionController = new InscripcionController_1.InscripcionController();
router.get('/all-enriched', (req, res) => inscripcionController.getAllInscripcionesEnriched(req, res));
exports.default = router;
//# sourceMappingURL=InscripcionRoutes.js.map