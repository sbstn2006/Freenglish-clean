import Groq from "groq-sdk";
import { ChatbotPort } from "../../domain/ChatbotPort";

export class AIAdapter implements ChatbotPort {

    private groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    });

    async sendMessage(message: string): Promise<string> {

        try {

            if (!process.env.GROQ_API_KEY) {
                throw new Error("GROQ_API_KEY no configurada");
            }

            const completion = await this.groq.chat.completions.create({
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

            return (
                completion.choices[0]?.message?.content ??
                "No pude generar una respuesta."
            );

        } catch (error) {
            console.error("Error en AIAdapter:", error);
            throw new Error("No se pudo obtener respuesta de la inteligencia artificial");
        }
    }
}