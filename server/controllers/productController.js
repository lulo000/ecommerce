// server/controllers/productController.js
import Product from "../models/Product.js";

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const results = await Product.getAll();
    res.json(results);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
};

// Obtener producto por ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.getById(id);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
  } catch (err) {
    console.error("Error al obtener producto:", err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
};

// Obtener productos por ID de categoría
export const getProductsByCategory = async (req, res) => {
  try {
    const { idCategoria } = req.params;
    const results = await Product.getByCategory(idCategoria);
    res.json(results);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
};

// Obtener productos por nombre de categoría
export const getProductsByCategoryName = async (req, res) => {
  try {
    const { nombreCategoria } = req.params;
    const results = await Product.getByCategoryName(nombreCategoria);
    res.json(results);
  } catch (err) {
    console.error("Error al obtener productos por categoría:", err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
};

// Crear nuevo producto (solo admin)
export const createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio, urlImg, idCategoria } = req.body;

    if (!nombre || !precio || !idCategoria) {
      return res.status(400).json({ error: "Nombre, precio y categoría son requeridos" });
    }

    const productData = { nombre, descripcion, precio, urlImg, idCategoria };
    const result = await Product.create(productData);
    
    res.status(201).json({
      message: "Producto creado exitosamente",
      id: result.insertId
    });
  } catch (err) {
    console.error("Error al crear producto:", err);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

// Actualizar producto (solo admin)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, urlImg, idCategoria } = req.body;

    if (!nombre || !precio || !idCategoria) {
      return res.status(400).json({ error: "Nombre, precio y categoría son requeridos" });
    }

    const productData = { nombre, descripcion, precio, urlImg, idCategoria };
    const result = await Product.update(id, productData);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "Producto actualizado exitosamente" });
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

// Eliminar producto (solo admin)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.delete(id);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

// Buscar productos por nombre
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query de búsqueda requerida" });
    }

    const results = await Product.searchByName(query);
    res.json(results);
  } catch (err) {
    console.error("Error al buscar productos:", err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
};
