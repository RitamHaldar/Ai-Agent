import { google } from "googleapis";

export const createOAuth2Client = () => new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REIDECT_URI
);

export const oAuth2ClientUser = createOAuth2Client();

export const getAuthUrl = (state) => {
    return oAuth2ClientUser.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/gmail.send"],
        prompt: "consent",
        state: state
    });
};


export const sendEmail = async ({ to, subject, html, refreshToken }) => {
    const auth = createOAuth2Client();
    if (refreshToken) {
        auth.setCredentials({ refresh_token: refreshToken });
    }
    
    const gmail = google.gmail({ version: "v1", auth });
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

