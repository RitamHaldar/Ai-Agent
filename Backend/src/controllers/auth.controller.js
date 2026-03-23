import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
//import { sendmail } from "../services/mail.service.js";
import { redis } from "../config/cache.js";

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
    /** await sendmail({
         to: email,
         subject: "Welcome to Axion AI",
         html: `
         <div style="background-color: #030305; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF; text-align: center;">
             <div style="max-width: 600px; margin: 0 auto; background-color: #0b0c10; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 40px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                 <div style="margin-bottom: 24px;">
                     <span style="font-size: 10px; font-weight: 900; letter-spacing: 0.4em; color: #888; text-transform: uppercase;">SentinelAI</span>
                 </div>
                 <h1 style="font-size: 28px; font-weight: 300; margin-bottom: 16px; letter-spacing: -0.02em;">Welcome, <span style="font-weight: 600; font-style: italic;">${username}</span></h1>
                 <p style="font-size: 16px; color: rgba(255, 255, 255, 0.7); line-height: 1.6; margin-bottom: 32px;">We're excited to have you on board Axion AI. Please verify your email to start augmenting your intelligence.</p>
                 
                 <a href="https://axion-ai-h2ll.onrender.com/api/auth/verify-email?token=${emailVerificationToken}" 
                    style="display: inline-block; background: linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 50%, #D1D5DB 100%); color: #000000; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; box-shadow: 0 10px 20px rgba(255,255,255,0.1); transition: all 0.3s ease;">
                     Verify Email Address
                 </a>
                 
                 <p style="font-size: 12px; color: rgba(255, 255, 255, 0.4); margin-top: 40px;">If you did not create an account, please ignore this email.</p>
                 <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                     <p style="font-size: 13px; color: rgba(255, 255, 255, 0.6);">Best regards,<br><strong style="color: #FFFFFF;">The SentinelAI Team</strong></p>
                 </div>
             </div>
         </div>
     `
     })*/
    res.cookie("token", emailVerificationToken)
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
        <div style="background-color: #030305; height: 100vh; display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF; margin: 0;">
            <div style="background-color: #0b0c10; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 60px 40px; text-align: center; max-width: 450px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.6);">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #FFFFFF 0%, #D1D5DB 100%); border-radius: 16px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 12px; letter-spacing: -0.02em;">Verified Successfully</h1>
                <p style="font-size: 15px; color: rgba(255, 255, 255, 0.6); line-height: 1.6; margin-bottom: 32px;">Hi ${user.username}, your account is now active. You can now access the full power of Axion AI.</p>
                
                <a href="https://axion-ai-h2ll.onrender.com/login" 
                   style="display: block; background: linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 50%, #D1D5DB 100%); color: #000000; padding: 14px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; box-shadow: 0 10px 20px rgba(255,255,255,0.1);">
                    Go to Login
                </a>
                
                <div style="margin-top: 40px; font-size: 12px; color: rgba(255, 255, 255, 0.3); letter-spacing: 0.1em; text-transform: uppercase;">
                    SentinelAI • Architectural Insights
                </div>
            </div>
        </div>
        <style>
            body { margin: 0; }
            a:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(255,255,255,0.2) !important; }
        </style>
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

/**
 * @description logout user
 * @route POST /api/auth/logout
 * @access private
 */

export async function logout(req, res) {
    const token = req.cookies.token;
    await redis.set(token, Date.now().toString(), "EX", 60 * 60 * 24 * 7);
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully",
        success: true
    })
}
