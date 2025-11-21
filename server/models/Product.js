// server/models/Product.js
import connection from "../config/DB.js";

class Product {
  // Obtener todos los productos
  static async getAll() {
    const sql = "SELECT * FROM productos";
    const [results] = await connection.query(sql);
    return results;
  }

  // Obtener producto por ID
  static async getById(id) {
    const sql = "SELECT * FROM productos WHERE idProducto = ?";
    const [results] = await connection.query(sql, [id]);
    return results[0];
  }

  // Obtener productos por categoría (ID)
  static async getByCategory(idCategoria) {
    const sql = "SELECT * FROM productos WHERE idCategoria = ?";
    const [results] = await connection.query(sql, [idCategoria]);
    return results;
  }

  // Obtener productos por nombre de categoría
  static async getByCategoryName(nombreCategoria) {
    const sql = `
      SELECT p.* 
      FROM productos p 
      INNER JOIN categorias c ON p.idCategoria = c.idCategoria 
      WHERE c.nombre = ?
    `;
    const [results] = await connection.query(sql, [nombreCategoria]);
    return results;
  }

  // Crear nuevo producto
  static async create(productData) {
    const sql = "INSERT INTO productos (nombre, descripcion, precio, urlImg, idCategoria) VALUES (?, ?, ?, ?, ?)";
    const values = [
      productData.nombre,
      productData.descripcion,
      productData.precio,
      productData.urlImg,
      productData.idCategoria
    ];
    const [result] = await connection.query(sql, values);
    return result;
  }

  // Actualizar producto
  static async update(id, productData) {
    const sql = "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, urlImg = ?, idCategoria = ? WHERE idProducto = ?";
    const values = [
      productData.nombre,
      productData.descripcion,
      productData.precio,
      productData.urlImg,
      productData.idCategoria,
      id
    ];
    const [result] = await connection.query(sql, values);
    return result;
  }

  // Eliminar producto
  static async delete(id) {
    const sql = "DELETE FROM productos WHERE idProducto = ?";
    const [result] = await connection.query(sql, [id]);
    return result;
  }

  // Buscar productos por nombre
  static async searchByName(searchQuery) {
    const sql = "SELECT * FROM productos WHERE nombre LIKE ?";
    const [results] = await connection.query(sql, [`%${searchQuery}%`]);
    return results;
  }
}

export default Product;
