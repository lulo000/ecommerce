// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connection from "./config/DB.js";
import productosRoutes from "./routes/productos.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Static hosting for images (e.g., /uploads/filename.jpg)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/productos", productosRoutes);

app.get("/api/categorias", (req, res) => {
  const sql = "SELECT * FROM categorias"; 
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error al consultar categorias:", err);
      res.status(500).json({ error: "Error en la base de datos" });
    } else {
      res.json(results);
    }
  });
});
app.get("/api/productos", (req, res) => {
  const sql = "SELECT * FROM productos"; 
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error al consultar categorias:", err);
      res.status(500).json({ error: "Error en la base de datos" });
    } else {
      res.json(results);
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
