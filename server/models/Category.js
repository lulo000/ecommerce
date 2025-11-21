// server/models/Category.js
import connection from "../config/DB.js";

class Category {
  // Obtener todas las categorías
  static async getAll() {
    const sql = "SELECT * FROM categorias";
    const [results] = await connection.query(sql);
    return results;
  }

  // Obtener categoría por ID
  static async getById(id) {
    const sql = "SELECT * FROM categorias WHERE idCategoria = ?";
    const [results] = await connection.query(sql, [id]);
    return results[0];
  }

  // Crear nueva categoría
  static async create(categoryData) {
    const sql = "INSERT INTO categorias (nombre) VALUES (?)";
    const values = [categoryData.nombre];
    const [result] = await connection.query(sql, values);
    return result;
  }

  // Actualizar categoría
  static async update(id, categoryData) {
    const sql = "UPDATE categorias SET nombre = ? WHERE idCategoria = ?";
    const values = [categoryData.nombre, id];
    const [result] = await connection.query(sql, values);
    return result;
  }

  // Eliminar categoría
  static async delete(id) {
    const sql = "DELETE FROM categorias WHERE idCategoria = ?";
    const [result] = await connection.query(sql, [id]);
    return result;
  }
}

export default Category;
