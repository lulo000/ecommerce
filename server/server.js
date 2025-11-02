// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connection from "./config/db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ejemplo: ruta para probar la conexión
app.get("/api/productos", (req, res) => {
  const sql = "SELECT * FROM productos"; // tu tabla en phpMyAdmin
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error al consultar productos:", err);
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
