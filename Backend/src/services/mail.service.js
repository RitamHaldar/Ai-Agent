import nodemailer from "nodemailer";
import "dotenv/config"
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    }
})
transporter.verify()
    .then(() => { console.log("SMTP server is ready") })
    .catch((err) => { console.log("SMTP server is not able to send mail", err) })
export async function sendmail({ to, subject, html }) {
    const data = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html

    }
    const mail = await transporter.sendMail(data)
    console.log("Mail sent successfully", mail);
}
