// server/controllers/categoryController.js
import Category from "../models/Category.js";

// Obtener todas las categorías
export const getAllCategories = async (req, res) => {
  try {
    const results = await Category.getAll();
    res.json(results);
  } catch (err) {
    console.error('Error al obtener categorías:', err);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

// Obtener categoría por ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.getById(id);
    if (!category) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.json(category);
  } catch (err) {
    console.error("Error al obtener categoría:", err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
};

// Crear nueva categoría (solo admin)
export const createCategory = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "El nombre es requerido" });
    }

    const categoryData = { nombre };
    const result = await Category.create(categoryData);
    
    res.status(201).json({
      message: "Categoría creada exitosamente",
      id: result.insertId
    });
  } catch (err) {
    console.error("Error al crear categoría:", err);
    res.status(500).json({ error: "Error al crear categoría" });
  }
};

// Actualizar categoría (solo admin)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "El nombre es requerido" });
    }

    const categoryData = { nombre };
    const result = await Category.update(id, categoryData);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.json({ message: "Categoría actualizada exitosamente" });
  } catch (err) {
    console.error("Error al actualizar categoría:", err);
    res.status(500).json({ error: "Error al actualizar categoría" });
  }
};

// Eliminar categoría (solo admin)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Category.delete(id);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.json({ message: "Categoría eliminada exitosamente" });
  } catch (err) {
    console.error("Error al eliminar categoría:", err);
    res.status(500).json({ error: "Error al eliminar categoría" });
  }
};
