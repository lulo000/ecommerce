// server/routes/categories.js
import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
import { validateCategory } from "../middlewares/validateRequest.js";

const router = express.Router();

// Rutas públicas
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Rutas protegidas (solo admin)
router.post("/", authenticateToken, isAdmin, validateCategory, createCategory);
router.put("/:id", authenticateToken, isAdmin, validateCategory, updateCategory);
router.delete("/:id", authenticateToken, isAdmin, deleteCategory);

export default router;
