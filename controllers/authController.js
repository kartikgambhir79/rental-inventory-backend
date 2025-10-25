import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, "SECRET_KEY", { expiresIn: "7d" });
};

// 🔹 Register
export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already in use" });

        const user = await User.create({ username, email, password, role });
        const token = generateToken(user);
        res.status(201).json({ success: true, user, token });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 🔹 Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = generateToken(user);
        res.json({ success: true, user, token });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 🔹 Get Current User
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
