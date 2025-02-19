// const router = require('express').Router();
// const UsersControllers = require('../controllers/users.controllers');
import express from "express";
import {getAllUsers, login, signup, updateProfileImage, updateProfile} from "../controllers/users.controllers.js";
import { auth } from "../middleware/auth.middleware.js";
const router = express.Router();

// Route test
router.get('/hello', (req, res) => {
    return res.status(200).json({ message: "Hello World" });
});

// Routes utilisateur
router.get('/', getAllUsers);
router.post('/signup', signup);
router.post('/login', login);
router.put('/update-profile-image', auth, updateProfileImage);
router.put('/update-profile', auth, updateProfile);
router.get('/check', auth, (req, res) => {
    res.status(200).json({ user: req.user });
});

// Route de déconnexion (à sécuriser avec un middleware `auth` si nécessaire)
router.get('/logout', (req, res) => {
    res.send("logout route");
});

export default router;
