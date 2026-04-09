import { createSlice } from "@reduxjs/toolkit"

/**
 * 
 * @param {string} chatId 
 * @param {string} title 
 * @param {string} Id 
 * @param {string} lastupdated 
 * @structure messages:{chatId1: {messages: [], title, Id, lastupdated},
 *                      chatId2: {messages: [], title, Id, lastupdated},
 *                      ...chatIdn: {messages: [], title, Id, lastupdated}}
 */
const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: {},
        loading: false,
        currentChatId: null,
        error: null
    },
    reducers: {
        addnewchat: (state, action) => {
            const { chatId, title } = action.payload;
            state.messages[chatId] = {
                messages: [],
                title,
                Id: chatId,
                lastupdated: new Date().toISOString()
            };
        },
        addMessage: (state, action) => {
            const { chatId, message, role, hasFile } = action.payload;
            state.messages[chatId].messages.push({ message, role, hasFile });
        },
        setmessages: (state, action) => {
            const { chatId, messages } = action.payload;
            if (!state.messages[chatId]) return;
            state.messages[chatId].messages = messages;
        },
        clearOtherMessages: (state, action) => {
            const chatId = action.payload;
            Object.keys(state.messages).forEach((id) => {
                if (id !== chatId) {
                    state.messages[id].messages = [];
                }
            });
        },
        setchats: (state, action) => {
            state.messages = action.payload;
        },
        setcurrentChatId: (state, action) => {
            state.currentChatId = action.payload;
        },
        setloading: (state, action) => {
            state.loading = action.payload;
        },
        seterror: (state, action) => {
            state.error = action.payload;
        }
    }
})

export const { addMessage, setloading, seterror, setchats, setcurrentChatId, setmessages, addnewchat, clearOtherMessages } = chatSlice.actions;
export default chatSlice.reducer;