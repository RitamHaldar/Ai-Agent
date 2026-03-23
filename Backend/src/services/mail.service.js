import nodemailer from "nodemailer";
import "dotenv/config"
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_APP_PASS
    },
    family: 4
})
transporter.verify()
    .then(() => {
        console.log("✅ SMTP server is ready to send mail");
    })
    .catch((err) => {
        console.error("❌ SMTP verification failed:");
        console.error("Error Code:", err.code);
        console.error("Error Message:", err.message);
        console.error("Stack Trace:", err.stack);
    });
export async function sendmail({ to, subject, html }) {
    const data = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html

    }
    await transporter.sendMail(data)
}
