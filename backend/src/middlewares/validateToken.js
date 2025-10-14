import jwt from "jsonwebtoken";
import { SECRET_TOKEN } from "../config/config.js";

export const authRequired = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) return res.status(401).json({ success: false, message: "No token, Unauthorized" });
    
    jwt.verify(token, SECRET_TOKEN, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: "Invalid token" });
        req.user = user;
        next();
    });
}