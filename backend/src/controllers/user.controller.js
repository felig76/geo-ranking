import User from "../models/user.model.js";

export const getUser = async (req, res) => {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: user });
}