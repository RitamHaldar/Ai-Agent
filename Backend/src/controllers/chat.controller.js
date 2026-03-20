import { chatModel } from "../models/chat.model.js"
import { messagesModel } from "../models/messages.model.js"
import { generateResponse, generateTitle } from "../services/ai.service.js"

export async function chatController(req, res) {
    const { message, chatId } = req.body
    let chat = null, title = null
    if (!chatId) {
        title = await generateTitle(message)
        chat = await chatModel.create({
            user: req.user.id,
            title
        })
    }
    const response = await generateResponse(message)
    const userMessage = await messagesModel.create({
        chat: chatId || chat._id,
        sender: "user",
        content: message
    })
    const aiMessage = await messagesModel.create({
        chat: chatId || chat._id,
        sender: "ai",
        content: response
    })
    res.status(200).json({
        message: "Chat created successfully",
        success: true,
        title,
        aiMessage
    })
}