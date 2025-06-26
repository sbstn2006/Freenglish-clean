import { Request, Response } from 'express';
import { sendMail } from '../adapter/MailService';

export class ContactController {
    async sendContactEmail(req: Request, res: Response) {
        try {
            const { nombre, email, mensaje } = req.body;

            // Validaciones
            if (!nombre || !email || !mensaje) {
                return res.status(400).json({ 
                    message: "Todos los campos son requeridos: nombre, email y mensaje" 
                });
            }

            if (!email.includes('@')) {
                return res.status(400).json({ 
                    message: "El email no tiene un formato válido" 
                });
            }

            // Preparar el contenido del correo
            const subject = `Nuevo mensaje de contacto desde Freenglish - ${nombre}`;
            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #16a34a;">Nuevo mensaje de contacto desde Freenglish</h2>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #374151; margin-top: 0;">Información del contacto:</h3>
                        <p><strong>Nombre:</strong> ${nombre}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES', { 
                            timeZone: 'America/Mexico_City' 
                        })}</p>
                    </div>
                    <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #16a34a; margin: 20px 0;">
                        <h3 style="color: #374151; margin-top: 0;">Mensaje:</h3>
                        <p style="line-height: 1.6; color: #4b5563;">${mensaje.replace(/\n/g, '<br>')}</p>
                    </div>
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        <p style="color: #6b7280; font-size: 14px;">
                            Este mensaje fue enviado desde el formulario de contacto de Freenglish
                        </p>
                    </div>
                </div>
            `;

            const text = `
Nuevo mensaje de contacto desde Freenglish

Información del contacto:
- Nombre: ${nombre}
- Email: ${email}
- Fecha: ${new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' })}

Mensaje:
${mensaje}

---
Este mensaje fue enviado desde el formulario de contacto de Freenglish
            `;

            // Enviar el correo
            const success = await sendMail({
                to: 'borrachosartesanos@gmail.com',
                subject,
                text,
                html
            });

            if (success) {
                res.status(200).json({ 
                    message: "Mensaje enviado correctamente. Te responderemos pronto." 
                });
            } else {
                res.status(500).json({ 
                    message: "Error al enviar el mensaje. Por favor, intenta de nuevo." 
                });
            }

        } catch (error) {
            console.error('Error en sendContactEmail:', error);
            res.status(500).json({ 
                message: "Error interno del servidor. Por favor, intenta de nuevo." 
            });
        }
    }
} 