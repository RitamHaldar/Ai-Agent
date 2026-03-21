import express from "express"
import { Identifyuser } from "../middlewares/auth.middleware.js"
import { chatController, getChatsController, getMessagesController, deleteChatController } from "../controllers/chat.controller.js"
import upload from "../middlewares/upload.middleware.js"

const chatroute = express.Router()

/**
 * @description Chat Controller
 * @route POST /api/chat
 * @access Private
 */
chatroute.post("/message", Identifyuser, upload.single("pdf"), chatController)

/**
 * @description Get Chats Controller
 * @route GET /api/chat
 * @access Private
 */
chatroute.get("/", Identifyuser, getChatsController)

/**
 * @description Get Messages Controller
 * @route GET /api/chat/messages
 * @access Private
 */

chatroute.get("/messages", Identifyuser, getMessagesController)

/**
 * @description Delete Chat Controller
 * @route DELETE /api/chat
 * @access Private
 */
chatroute.delete("/", Identifyuser, deleteChatController)

export default chatroute