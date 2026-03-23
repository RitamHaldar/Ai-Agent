import nodemailer from "nodemailer";
import "dotenv/config"
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_APP_PASS
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
    await transporter.sendMail(data)
}
