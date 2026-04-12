import jwt from "jsonwebtoken";
import { getAuthUrl, createOAuth2Client } from "../services/autosend.service.js";
import { emailModel } from "../models/email.model.js";


export async function getAuthUrlController(req, res) {
    try {
        const token = req.cookies.token;
        const authUrl = getAuthUrl(token);
        res.redirect(authUrl);
    } catch (error) {
        console.error("Error getting auth URL:", error);
        res.status(500).json({ error: "Failed to get auth URL" });
    }
}

export async function handleCallback(req, res) {
    try {
        const token = req.query.state;
        if (!token) {
            return res.status(401).json({ error: "State parameter missing (Unauthorized)" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id || decoded._id;

        const code = req.query.code;
        const client = createOAuth2Client();
        const { tokens } = await client.getToken(code);

        let userEmailRecord = await emailModel.findOne({ user: userId });

        if (userEmailRecord) {
            userEmailRecord.refreshToken = tokens.refresh_token;
            userEmailRecord.enabled = true;
            await userEmailRecord.save();
        } else {
            await emailModel.create({
                user: userId,
                refreshToken: tokens.refresh_token,
                enabled: true
            });
        }

        res.redirect("https://axion-ai-h2ll.onrender.com");
    } catch (error) {
        console.error("Error handling callback:", error);
        res.status(500).json({ error: "Failed to handle callback: " + error.message });
    }
}

export async function clearEmailController(req, res) {
    try {
        const userId = req.user.id || req.user._id;
        await emailModel.findOneAndDelete({ user: userId });
        res.status(200).json({
            message: "Email cleared successfully",
            success: true
        });
    } catch (error) {
        console.error("Error clearing email:", error);
        res.status(500).json({
            error: "Failed to clear email",
            success: false
        });
    }
}

