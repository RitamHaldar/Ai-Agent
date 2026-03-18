import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendmail } from "../services/mail.service.js";

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
    const emailVerificationToken = jwt.sign({
        id: user._id,
        username: user.username
    },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )
    await sendmail({
        to: email,
        subject: "Welcome to SentinelAI",
        html: `<p>Hi ${username},</p>
                <p>Thank you for registering at <strong>SentinelAI</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The SentinelAI Team</p>
    `
    })
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
    }).select("+password")
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
            email: user.email,
            user: user.username,

        }
    })
}

/**
 * @description get me
 * @route GET /api/auth/getme
 * @access private
 */

export async function getme(req, res) {
    const id = req.user.id
    const user = await userModel.findById(id);
    res.status(200).json({
        message: "User fetched successfully",
        success: true,
        user
    })
}

/**
 * @description verify email
 * @route GET /api/auth/verify-email
 * @access public
 */

export async function verifyemail(req, res) {
    const { token } = req.query;
    console.log(token)
    try {
        const decodedtoken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decodedtoken.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                err: "User not found"
            })
        }
        user.verified = true;
        await user.save();
        const html = `
        <p>Hi ${user.username},</p>
        <p>Your email has been verified successfully.</p>
        <p>You can now login to your account.<a href="http://localhost:3000/api/auth/login">Login</a></p>
        <p>Best regards,<br>The SentinelAI Team</p>
        `
        res.send(html);
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            err: "Internal server error"
        })
    }
}