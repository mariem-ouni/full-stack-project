// const User = require('../models/users_Model');
import User from '../models/users.model.js';
// const bcrypt = require('bcryptjs');
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from '../db/cloudinary.js';

/*******get all users */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({ users })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error", err })
    }
}

/******signup */
export const signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.status(400).json({ message: 'user already exist' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newuser = new User({
            fullname,
            email,
            password: hashedPassword
        })
        await newuser.save()
        // return res.status(200).json({ message: "user created successfully", newuser })
        return res.status(201).json({
            _id: newuser._id,
            fullName: newuser.fullname,
            email: newuser.email,
            profilePic: newuser.profilePic,
        });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error", err })
    }
}
/****** login  */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si email et password sont fournis
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Vérifier si l'utilisateur existe
        const userExist = await User.findOne({ email: email });
        if (!userExist) {
            return res.status(400).json({ message: "User does not exist" });
        }
        console.log(userExist);
        console.log("Entered password:", password);
        console.log("Stored hash:", userExist.password);
        // Vérifier si le mot de passe est correct
        const isMatch = await bcrypt.compare(password, userExist.password);
        console.log(isMatch)

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Générer le token
        const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        return res.status(200).json({ message: "User logged in successfully", user: userExist, token });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

/******update profile picture */
export const updateProfileImage = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // user.fullname = fullname || user.fullname;
        // user.email = email || user.email;
        // await user.save();
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );
        return res.status(200).json({ message: "Profile picture updated successfully", user: updatedUser });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error", err })
    }
}

/******update profile picture */
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        await user.save();
        return res.status(200).json({ message: "Profile updated successfully", user });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "server error", err })
    }
}