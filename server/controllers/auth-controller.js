import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { generateToken } from "../lib/utils.js";
import { cloudinary } from "../lib/cloudinary.js";

const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Invalid inputs passed, please check your data" });
    }

    const { username, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } 
    catch (err) {
        return res.status(500).json({ message: "Signing up failed, please try again later" });
    }

    if (existingUser) {
        return res.status(400).json({ message: "User already exists, login instead" });
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    }
    catch (err) {
        return res.status(500).json({ message: "Signing up failed, please try again later" });
    }

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });

    try {
        await newUser.save();
    }
    catch (err) {
        return res.status(500).json({ message: "Signing up failed, please try again later" });
    }

    generateToken(newUser._id, res);

    res.status(201).json({ 
        message: "User created successfully",
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic
    });
}

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Invalid inputs passed, please check your data" });
    }

    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    }
    catch (err) {
        return res.status(500).json({ message: "Logging in failed, please try again later" });
    }

    if (!existingUser) {
        return res.status(403).json({ message: "Invalid credentials, could not log you in" });
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    }
    catch (err) {
        return res.status(500).json({ message: "Logging in failed, please try again later" });
    }

    if (!isValidPassword) {
        return res.status(403).json({ message: "Invalid credentials, could not log you in" });
    }

    generateToken(existingUser._id, res);

    res.status(200).json({ 
        message: "Logged in successfully",
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        profilePic: existingUser.profilePic
    });
}

const logout = async (req, res) => {
    try{
        res.clearCookie('jwt');
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: "Logging out failed, please try again later" });
    }
}

const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic) {
            return res.status(400).json({ message: "Please provide a profile picture" });
        }

        const uploadedImage = await cloudinary.uploader.upload(profilePic);

        const user = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadedImage.secure_url },
            { new: true }
        )

        res.status(200).json(user);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Updating profile failed, please try again later" });
    }
}

const checkAuth = (req, res) => { 
    try {
        res.status(200).json(req.user);
    }
    catch (err) {
        res.status(500).json({ message: "User not authenticated" });
    }
}

export { signup, login, logout, updateProfile, checkAuth };