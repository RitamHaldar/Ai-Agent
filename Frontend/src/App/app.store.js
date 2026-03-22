import { configureStore } from "@reduxjs/toolkit"
import authrreducer from "../Features/Auth/auth.slice"
import chatreducer from "../Features/Chat/chat.slice"
export const store = configureStore({
    reducer: {
        auth: authrreducer,
        chat: chatreducer
    }
})