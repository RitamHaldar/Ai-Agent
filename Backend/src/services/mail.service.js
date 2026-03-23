import { Resend } from 'resend';
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendmail({ to, subject, html }) {
    if (!process.env.RESEND_API_KEY) {
        console.error("❌ RESEND_API_KEY is missing from environment variables!");
        throw new Error("Missing Email API Key");
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: [to],
            subject: subject,
            html: html
        });

        if (error) {
            console.error(`❌ Resend API Error:`, error);
            throw new Error(error.message || "Failed to send email via Resend API");
        }

        console.log(`✅ Email sent successfully to ${to} via Resend. ID: ${data.id}`);
    } catch (error) {
        console.error(`❌ Encountered an error sending email to ${to}:`, error);
        throw error;
    }
}
