import { chatModel } from "../models/chat.model.js"
import { messageModel } from "../models/messages.model.js"
import { generateResponse, generateTitle } from "../services/ai.service.js"
import { uploadPDF } from "../services/pdfupload.service.js"
import { readPDF } from "../services/pdfreading.service.js"

/**
 * @description Chat Controller
 * @route POST /api/chat
 * @access Private
 */

export async function chatController(req, res) {
    const { message, chatId } = req.body;
    const file = req.file ? req.file : null;
    let chat = null, title = null, pdfcontent = null;
    if (file) {
        try {
            const pdfurl = await uploadPDF(file);
            pdfcontent = await readPDF(pdfurl);
        } catch (error) {
            console.log(error)
        }
    }
    if (!chatId) {
        title = await generateTitle(message)
        chat = await chatModel.create({
            user: req.user.id,
            title
        })
    }
    const userMessage = await messageModel.create({
        chat: chatId || chat._id,
        role: "user",
        content: pdfcontent ? message + "\n\n" + pdfcontent : message
    })
    const messages = await messageModel.find({
        chat: chatId || chat._id
    })
    const response = await generateResponse(messages)
    const aiMessage = await messageModel.create({
        chat: chatId || chat._id,
        role: "ai",
        content: response
    })
    res.status(200).json({
        message: "Chat created successfully",
        chatId: chatId || chat._id,
        success: true,
        title,
        aiMessage
    })
}

/**
 * @description Get Chats Controller
 * @route GET /api/chat
 * @access Private
 */

export async function getChatsController(req, res) {
    const chats = await chatModel.find({
        user: req.user.id
    }).sort({ createdAt: -1 })
    res.status(200).json({
        message: "Chats fetched successfully",
        success: true,
        chats
    })
}

/**
 * @description Get Messages Controller
 * @route GET /api/chat/:chatId/messages
 * @access Private
 */

export async function getMessagesController(req, res) {
    const { chatId } = req.params
    const messages = await messageModel.find({
        chat: chatId
    })
    res.status(200).json({
        message: "Messages fetched successfully",
        success: true,
        messages
    })
}

/**
 * @description Delete Chat Controller
 * @route DELETE /api/chat
 * @access Private
 */

export async function deleteChatController(req, res) {
    const { chatId } = req.params
    await chatModel.findByIdAndDelete(chatId)
    await messageModel.deleteMany({
        chat: chatId
    })
    res.status(200).json({
        message: "Chat deleted successfully",
        success: true
    })
}
