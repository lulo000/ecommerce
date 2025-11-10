// server/models/Category.js
import connection from "../config/DB.js";

class Category {
  // Obtener todas las categorías
  static getAll(callback) {
    const sql = "SELECT * FROM categorias";
    connection.query(sql, callback);
  }

  // Obtener categoría por ID
  static getById(id, callback) {
    const sql = "SELECT * FROM categorias WHERE idCategoria = ?";
    connection.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }

  // Crear nueva categoría
  static create(categoryData, callback) {
    const sql = "INSERT INTO categorias (nombre) VALUES (?)";
    const values = [categoryData.nombre];
    connection.query(sql, values, callback);
  }

  // Actualizar categoría
  static update(id, categoryData, callback) {
    const sql = "UPDATE categorias SET nombre = ? WHERE idCategoria = ?";
    const values = [categoryData.nombre, id];
    connection.query(sql, values, callback);
  }

  // Eliminar categoría
  static delete(id, callback) {
    const sql = "DELETE FROM categorias WHERE idCategoria = ?";
    connection.query(sql, [id], callback);
  }
}

export default Category;
