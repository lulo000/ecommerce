// server/routes/products.js
import express from "express";
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProductsByCategoryName,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} from "../controllers/productController.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
import { validateProduct } from "../middlewares/validateRequest.js";

const router = express.Router();

// Rutas públicas
router.get("/", getAllProducts);
router.get("/search", searchProducts); // Debe ir antes de /:id
router.get("/:id", getProductById);
router.get("/categoria/:idCategoria", getProductsByCategory);
router.get("/categoria/nombre/:nombreCategoria", getProductsByCategoryName);

// Rutas protegidas (solo admin)
router.post("/", authenticateToken, isAdmin, validateProduct, createProduct);
router.put("/:id", authenticateToken, isAdmin, validateProduct, updateProduct);
router.delete("/:id", authenticateToken, isAdmin, deleteProduct);

export default router;
