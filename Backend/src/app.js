import express from "express";
import cookieParser from "cookie-parser";
import authroute from "./routes/auth.routes.js"
import chatroute from "./routes/chats.routes.js"
import cors from "cors"

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.json());
app.use(cors({
    origin: "https://axion-ai-h2ll.onrender.com",
    credentials: true
}))

/**
 * @description Routes
 */
app.use("/api/auth", authroute);
app.use("/api/chat", chatroute);
app.use(express.static("./Public"))
export default app;