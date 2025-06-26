import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER || 'borrachosartesanos@gmail.com', 
    pass: process.env.MAIL_PASS || 'fcre hhgg wrbh gfbr', 
  },
});

export async function sendMail({ to, subject, text, html }: { to: string; subject: string; text?: string; html?: string }) {
  const mailOptions = {
    from: process.env.MAIL_USER || 'borrachosartesanos@gmail.com',
    to,
    subject,
    text,
    html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
    return true;
  } catch (error) {
    console.error('Error enviando correo:', error);
    return false;
  }
} 