import { google } from "googleapis";

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);
oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
})
const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

export const sendMail = async ({ to, subject, html }) => {
    const message = [
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=utf-8",
        `From: "Axion Ai" <${process.env.EMAIL_USER || "me"}>`,
        `To: ${to}`,
        `Subject: ${subject}`,
        "",
        html,
    ].join("\r\n");

    const encodedMessage = Buffer.from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    await gmail.users.messages.send({
        userId: "me",
        requestBody: {
            raw: encodedMessage,
        },
    });
}

