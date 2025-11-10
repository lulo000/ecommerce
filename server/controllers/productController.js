// server/controllers/productController.js
import Product from "../models/Product.js";

// Obtener todos los productos
export const getAllProducts = (req, res) => {
  Product.getAll((err, results) => {
    if (err) {
      console.error("Error al obtener productos:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }
    res.json(results);
  });
};

// Obtener producto por ID
export const getProductById = (req, res) => {
  const { id } = req.params;
  Product.getById(id, (err, product) => {
    if (err) {
      console.error("Error al obtener producto:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
  });
};

// Obtener productos por ID de categoría
export const getProductsByCategory = (req, res) => {
  const { idCategoria } = req.params;
  Product.getByCategory(idCategoria, (err, results) => {
    if (err) {
      console.error("Error al obtener productos:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }
    res.json(results);
  });
};

// Obtener productos por nombre de categoría
export const getProductsByCategoryName = (req, res) => {
  const { nombreCategoria } = req.params;
  Product.getByCategoryName(nombreCategoria, (err, results) => {
    if (err) {
      console.error("Error al obtener productos por categoría:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }
    res.json(results);
  });
};

// Crear nuevo producto (solo admin)
export const createProduct = (req, res) => {
  const { nombre, descripcion, precio, urlImg, idCategoria } = req.body;

  if (!nombre || !precio || !idCategoria) {
    return res.status(400).json({ error: "Nombre, precio y categoría son requeridos" });
  }

  const productData = { nombre, descripcion, precio, urlImg, idCategoria };

  Product.create(productData, (err, result) => {
    if (err) {
      console.error("Error al crear producto:", err);
      return res.status(500).json({ error: "Error al crear producto" });
    }
    res.status(201).json({
      message: "Producto creado exitosamente",
      id: result.insertId
    });
  });
};

// Actualizar producto (solo admin)
export const updateProduct = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, urlImg, idCategoria } = req.body;

  if (!nombre || !precio || !idCategoria) {
    return res.status(400).json({ error: "Nombre, precio y categoría son requeridos" });
  }

  const productData = { nombre, descripcion, precio, urlImg, idCategoria };

  Product.update(id, productData, (err, result) => {
    if (err) {
      console.error("Error al actualizar producto:", err);
      return res.status(500).json({ error: "Error al actualizar producto" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "Producto actualizado exitosamente" });
  });
};

// Eliminar producto (solo admin)
export const deleteProduct = (req, res) => {
  const { id } = req.params;

  Product.delete(id, (err, result) => {
    if (err) {
      console.error("Error al eliminar producto:", err);
      return res.status(500).json({ error: "Error al eliminar producto" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado exitosamente" });
  });
};

// Buscar productos por nombre
export const searchProducts = (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query de búsqueda requerida" });
  }

  Product.searchByName(query, (err, results) => {
    if (err) {
      console.error("Error al buscar productos:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }
    res.json(results);
  });
};
