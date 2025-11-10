// server/routes/auth.js
import express from "express";
import {
  register,
  login,
  validateToken,
  getProfile
} from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validateRegister, validateLogin } from "../middlewares/validateRequest.js";

const router = express.Router();

// Rutas públicas
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

// Rutas protegidas (requieren autenticación)
router.get("/validate", authenticateToken, validateToken);
router.get("/profile", authenticateToken, getProfile);

export default router;
