import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
    const { email, password, username } = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        
        const savedUser = await newUser.save();
        const token = await generateAccessToken({ id: savedUser._id });

        res.cookie("token", token);
        res.status(201).json({ success: true, data: {
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt
        } });
        
    } catch (error) {
        console.error("Error al guardar el usuario:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }    
};

export const login = async (req, res) => res.send("login");