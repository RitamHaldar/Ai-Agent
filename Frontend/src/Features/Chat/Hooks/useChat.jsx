import { useDispatch } from "react-redux"
import { createChat, getChats, getMessages, deleteChat } from "../Services/chat.api"
import { setloading, setchats, setmessages, addnewchat, addMessage } from "../chat.slice"

const useChat = () => {
    const dispatch = useDispatch()

    const handleGetChats = async () => {
        dispatch(setloading(true))
        const response = await getChats()
        dispatch(setchats(response.data.chats.reduce((acc, chat) => {
            acc[chat._id] = {
                messages: [],
                title: chat.title,
                Id: chat._id,
                lastupdated: chat.lastupdated
            }
            return acc
        }, {})))
        dispatch(setloading(false))
        return response
    }

    const handlesendMessage = async ({ message, chatId, file }) => {
        try {
            if (chatId) {
                dispatch(addMessage({ chatId, message, role: "user" }))
            }
            dispatch(setloading(true))
            const response = await createChat({ message, chatId, file })
            if (!chatId) {
                dispatch(addnewchat({ chatId: response.data.chatId, title: response.data.title }))
                dispatch(addMessage({ chatId: response.data.chatId, message: message, role: "user" }))
            }
            dispatch(addMessage({ chatId: response.data.chatId || chatId, message: response.data.aiMessage.content, role: "ai" }))
            return response

        } finally {
            dispatch(setloading(false))
        }
    }

    const handleGetMessages = async (chatId) => {
        dispatch(setloading(true))
        const response = await getMessages(chatId)
        dispatch(setmessages({
            chatId, messages: response.data.messages.reduce((acc, message) => {
                acc.push({
                    message: message.content,
                    role: message.role
                })
                return acc
            }, [])
        }))
        dispatch(setloading(false))
        return response
    }
    const handleDeleteChat = async (chatId, messages = []) => {
        const response = await deleteChat(chatId)
        handleGetChats();
        dispatch(setmessages({ chatId, messages }));
        return response
    }
    return {
        handlesendMessage,
        handleGetChats,
        handleGetMessages,
        handleDeleteChat
    }
}

export default useChat