// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Importar rutas
import authRoutes from "./routes/auth.js";
import productosRoutes from "./routes/productos.js";
import categoriesRoutes from "./routes/categories.js";

// Importar middlewares
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static hosting for images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/categorias", categoriesRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ 
    message: "API de E-commerce funcionando correctamente",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      productos: "/api/productos",
      categorias: "/api/categorias"
    }
  });
});

// Middlewares de manejo de errores (deben ir al final)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

