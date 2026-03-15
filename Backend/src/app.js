import express from "express";
import cookieParser from "cookie-parser";
import authroute from "./routes/user.routes.js"
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.json());
app.use("/api/auth", authroute)
export default app;