import express from "express";
import connection from "../config/DB.js";

const router = express.Router();

// Ruta para obtener productos por ID de categoría
router.get("/categoria/:idCategoria", (req, res) => {
  const { idCategoria } = req.params;
  const sql = "SELECT * FROM productos WHERE idCategoria = ?";
  connection.query(sql, [idCategoria], (err, results) => {
    if (err) {
      console.error("Error al obtener productos:", err);
      res.status(500).json({ error: "Error en la base de datos" });
    } else {
      res.json(results);
    }
  });
});

// Ruta para obtener productos por nombre de categoría
router.get("/categoria/nombre/:nombreCategoria", (req, res) => {
  const { nombreCategoria } = req.params;
  const sql = `
    SELECT p.* 
    FROM productos p 
    INNER JOIN categorias c ON p.idCategoria = c.idCategoria 
    WHERE c.nombre = ?
  `;
  connection.query(sql, [nombreCategoria], (err, results) => {
    if (err) {
      console.error("Error al obtener productos por categoría:", err);
      res.status(500).json({ error: "Error en la base de datos" });
    } else {
      res.json(results);
    }
  });
});

export default router;
