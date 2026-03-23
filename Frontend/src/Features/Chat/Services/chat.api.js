import axios from "axios"

/**
 * @description Axios Instance
 */

const api = axios.create({
    baseURL: "https://axion-ai-8k1l.onrender.com",
    withCredentials: true
})

/**
 * @description Create Chat
 * @route GET /api/chat/message
 * @access Private
 */

export async function createChat({ message, chatId, file }) {
    const formData = new FormData();
    formData.append("message", message);
    formData.append("chatId", chatId);
    formData.append("pdf", file);
    const response = await api.post("/api/chat/message", formData)
    return response
}

/**
 * @description Get Chats
 * @route GET /api/chat
 * @access Private
 */

export async function getChats() {
    const response = await api.get("/api/chat")
    return response
}

/**
 * @description Get Messages
 * @route GET /api/chat/:chatId/messages
 * @access Private
 */

export async function getMessages(chatId) {
    const response = await api.get(`/api/chat/${chatId}/messages`)
    return response
}

/**
 * @description Delete Chat
 * @route DELETE /api/chat/:chatId
 * @access Private
 */

export async function deleteChat(chatId) {
    const response = await api.delete(`/api/chat/${chatId}`)
    return response
}
