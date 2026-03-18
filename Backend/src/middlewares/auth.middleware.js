import jwt from "jsonwebtoken"

export function Identifyuser(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "Token not present",
            success: false,
            err: "Token not available"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({
            message: "Token not verified",
            success: false,
            err: "Token cannot be authorized"
        })
    }
}