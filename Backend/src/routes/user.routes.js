import express from "express"
import { registerValidator, loginValidator } from "../validator/auth.validator";
import { register, login } from "../controllers/user.controller";
const authroute = express.Router();
/**
 * @description register user
 * @route POST /api/auth/register
 * @access public
 */
authroute.post("/register", registerValidator, register)
/**
 * @description login user
 * @route GET /api/auth/login
 * @access public
 */
authroute.get("/login", loginValidator, login)
export default authroute