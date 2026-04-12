import { chatModel } from "../models/chat.model.js"
import { messageModel } from "../models/messages.model.js"
import { streamResponse, generateTitle } from "../services/ai.service.js"
import { readPDF, generateImageDescription } from "../services/filereading.service.js"
import { getIO } from "../sockets/server.socket.js"
/**
 * @description Chat Controller
 * @route POST /api/chat
 * @access Private
 */

export async function chatController(req, res) {
    const { message, chatId, socketId } = req.body;
    const file = req.file ? req.file : null;;


    let chat = null, title = null, pdfcontent = null, imageDescription = null;
    if (file) {
        if (file.mimetype === "application/pdf") {
            try {
                pdfcontent = await readPDF(file.buffer);
            } catch (error) {
                console.log(error)
            }
        } else if (file.mimetype.startsWith("image/")) {
            try {
                imageDescription = await generateImageDescription(file.buffer);
            } catch (error) {
                console.log(error)
            }
        }
    }
    if (!chatId) {
        title = await generateTitle(message)
        chat = await chatModel.create({
            user: req.user.id,
            title
        })
    }
    const currentChatId = chatId || chat._id;
    await messageModel.create({
        chat: currentChatId,
        role: "user",
        content: message,
        additionalContent: pdfcontent || imageDescription || ""
    })

    const messages = await messageModel.find({
        chat: currentChatId
    }).sort({ createdAt: 1 }).select("+additionalContent");
    const io = getIO();

    const responseContent = await streamResponse(messages, (chunk) => {
        if (socketId) {
            io.to(socketId).emit("message", chunk);
        }
    });



    const aiMessage = await messageModel.create({
        chat: currentChatId,
        role: "ai",
        content: responseContent
    })
    if (socketId) {
        io.to(socketId).emit("message-complete", {
            chatId: currentChatId,
            title: title || undefined,
            aiMessage
        });
    }

    res.status(200).json({
        message: "Chat processed successfully",
        chatId: currentChatId,
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
