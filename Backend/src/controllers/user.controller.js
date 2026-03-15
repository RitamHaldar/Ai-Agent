import { userModel } from "../models/user.model";
import jwt from "jsonwebtoken";
/**
 * @description register user
 * @route POST /api/auth/register
 * @access public
 */
export async function register(req, res) {
    const { username, email, password } = req.body;
    const userexists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })
    if (userexists) {
        return res.status(400).json({
            message: "User already exists with this" + (email ? email : username),
            success: false,
            err: "User exists"
        })
    }
    const user = await userModel.create({ username, email, password });
    res.status(201).json({
        message: "User created successfully",
        success: true,
        user: {
            id: user.id,
            user: user.username,
        }
    })
}
/**
 * @description login user
 * @route GET /api/auth/login
 * @access public
 */
export async function login(req, res) {
    const { username, email, password } = req.body;
    const user = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })
    if (!user) {
        return res.status(404).json({
            message: "User does not exist register to continue",
            success: false,
            err: "User not registered"
        })
    }
    const comparepassword = await user.comparePassword(password);
    if (!comparepassword) {
        return res.status(401).json({
            message: "Invalid password",
            success: false,
            err: "Invalid password"
        })
    }
    if (!user.verified) {
        return res.status(401).json({
            message: "User not verified ",
            success: false,
            err: "User not verified"
        })
    }
    const token = jwt.sign({
        id: user._id,
        username: user.username
    },
        process.env.JWT_SECRET,
        { expiresIn: "7d" })
    res.cookie("token", token);
    res.status(200).json({
        message: "User logged in successfully",
        success: true,
        user: {
            id: user.id,
            user: user.username,
        }
    })
}