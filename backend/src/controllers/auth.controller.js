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

export const login = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = await generateAccessToken({ id: user._id });

        res.cookie("token", token);
        res.status(201).json({ success: true, data: {
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        } });
        
    } catch (error) {
        console.error("Error al guardar el usuario:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }    
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logout successful" });
}

export const profile = async (req, res) => {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    } });
}