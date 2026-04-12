import { Router } from "express";
import { getAuthUrlController, handleCallback } from "../controllers/email.controller.js";
import { Identifyuser } from "../middlewares/auth.middleware.js";
const emailRouter = Router();

emailRouter.get("/", Identifyuser, getAuthUrlController);
emailRouter.get("/oauth2callback", handleCallback);


export default emailRouter;