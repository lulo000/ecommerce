// server/models/Product.js
import connection from "../config/DB.js";

class Product {
  // Obtener todos los productos
  static getAll(callback) {
    const sql = "SELECT * FROM productos";
    connection.query(sql, callback);
  }

  // Obtener producto por ID
  static getById(id, callback) {
    const sql = "SELECT * FROM productos WHERE idProducto = ?";
    connection.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }

  // Obtener productos por categoría (ID)
  static getByCategory(idCategoria, callback) {
    const sql = "SELECT * FROM productos WHERE idCategoria = ?";
    connection.query(sql, [idCategoria], callback);
  }

  // Obtener productos por nombre de categoría
  static getByCategoryName(nombreCategoria, callback) {
    const sql = `
      SELECT p.* 
      FROM productos p 
      INNER JOIN categorias c ON p.idCategoria = c.idCategoria 
      WHERE c.nombre = ?
    `;
    connection.query(sql, [nombreCategoria], callback);
  }

  // Crear nuevo producto
  static create(productData, callback) {
    const sql = "INSERT INTO productos (nombre, descripcion, precio, urlImg, idCategoria) VALUES (?, ?, ?, ?, ?)";
    const values = [
      productData.nombre,
      productData.descripcion,
      productData.precio,
      productData.urlImg,
      productData.idCategoria
    ];
    connection.query(sql, values, callback);
  }

  // Actualizar producto
  static update(id, productData, callback) {
    const sql = "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, urlImg = ?, idCategoria = ? WHERE idProducto = ?";
    const values = [
      productData.nombre,
      productData.descripcion,
      productData.precio,
      productData.urlImg,
      productData.idCategoria,
      id
    ];
    connection.query(sql, values, callback);
  }

  // Eliminar producto
  static delete(id, callback) {
    const sql = "DELETE FROM productos WHERE idProducto = ?";
    connection.query(sql, [id], callback);
  }

  // Buscar productos por nombre
  static searchByName(searchQuery, callback) {
    const sql = "SELECT * FROM productos WHERE nombre LIKE ?";
    connection.query(sql, [`%${searchQuery}%`], callback);
  }
}

export default Product;
