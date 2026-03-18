import { configureStore } from "@reduxjs/toolkit"
import authrreducer from "../Features/Auth/auth.slice"
export const store = configureStore({
    reducer: {
        auth: authrreducer
    }
})