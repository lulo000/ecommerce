// server/controllers/categoryController.js
import Category from "../models/Category.js";

// Obtener todas las categorías
export const getAllCategories = (req, res) => {
  Category.getAll((err, results) => {
    if (err) {
      console.error("Error al obtener categorías:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }
    res.json(results);
  });
};

// Obtener categoría por ID
export const getCategoryById = (req, res) => {
  const { id } = req.params;
  Category.getById(id, (err, category) => {
    if (err) {
      console.error("Error al obtener categoría:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }
    if (!category) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.json(category);
  });
};

// Crear nueva categoría (solo admin)
export const createCategory = (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "El nombre es requerido" });
  }

  const categoryData = { nombre };

  Category.create(categoryData, (err, result) => {
    if (err) {
      console.error("Error al crear categoría:", err);
      return res.status(500).json({ error: "Error al crear categoría" });
    }
    res.status(201).json({
      message: "Categoría creada exitosamente",
      id: result.insertId
    });
  });
};

// Actualizar categoría (solo admin)
export const updateCategory = (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "El nombre es requerido" });
  }

  const categoryData = { nombre };

  Category.update(id, categoryData, (err, result) => {
    if (err) {
      console.error("Error al actualizar categoría:", err);
      return res.status(500).json({ error: "Error al actualizar categoría" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.json({ message: "Categoría actualizada exitosamente" });
  });
};

// Eliminar categoría (solo admin)
export const deleteCategory = (req, res) => {
  const { id } = req.params;

  Category.delete(id, (err, result) => {
    if (err) {
      console.error("Error al eliminar categoría:", err);
      return res.status(500).json({ error: "Error al eliminar categoría" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.json({ message: "Categoría eliminada exitosamente" });
  });
};
