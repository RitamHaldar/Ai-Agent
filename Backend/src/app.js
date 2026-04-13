import express from "express";
import cookieParser from "cookie-parser";
import authroute from "./routes/auth.routes.js"
import chatroute from "./routes/chats.routes.js"
import cors from "cors"
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
const app = express();
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.json());
app.use(cors({
    origin: "https://axion-ai-h2ll.onrender.com",
    credentials: true
}))
app.use(passport.initialize());
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    proxy: true,
    scope: ["profile", "email"]
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));
/**
 * @description Routes
 */
app.use("/api/auth", authroute);
app.use("/api/chat", chatroute);
app.use(express.static("./Public"))
export default app;