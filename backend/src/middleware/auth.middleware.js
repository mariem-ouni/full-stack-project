import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

export const auth = async (req, res, next) => {
    try {
        // const token = req.cookies.jwt; // Récupérer le token depuis les cookies

        // Récupérer le token depuis le header
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Trouver l'utilisateur correspondant au token
        const user = await User.findById(decoded.id).select("-password"); // On exclut le mot de passe

        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        req.user = user; // Stocker l'utilisateur dans `req.user`
        next(); // Passer au middleware suivant
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({ message: "Invalid Token" });
    }
};
