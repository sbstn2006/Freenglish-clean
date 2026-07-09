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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAdapter = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
class AIAdapter {
    constructor() {
        this.groq = new groq_sdk_1.default({
            apiKey: process.env.GROQ_API_KEY,
        });
    }
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                if (!process.env.GROQ_API_KEY) {
                    throw new Error("GROQ_API_KEY no configurada");
                }
                const completion = yield this.groq.chat.completions.create({
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.4,
                    messages: [
                        {
                            role: "system",
                            content: `
Eres Freenglish AI, un profesor virtual de inglés.

Tu función es ayudar a estudiantes de nivel básico e intermedio.

Debes:

- Explicar gramática inglesa paso a paso.
- Corregir oraciones mostrando:
  1. La oración original.
  2. La corrección.
  3. La explicación del error.
- Dar ejemplos en inglés con su traducción al español.
- Explicar vocabulario.
- Ayudar con pronunciación usando escritura fonética cuando sea útil.
- Mantener un tono amigable y educativo.
- No responder preguntas que no estén relacionadas con el aprendizaje del inglés.
`
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ]
                });
                return ((_c = (_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) !== null && _c !== void 0 ? _c : "No pude generar una respuesta.");
            }
            catch (error) {
                console.error("Error en AIAdapter:", error);
                throw new Error("No se pudo obtener respuesta de la inteligencia artificial");
            }
        });
    }
}
exports.AIAdapter = AIAdapter;
//# sourceMappingURL=AIAdapter.js.map