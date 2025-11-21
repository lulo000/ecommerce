// server/models/User.js
import connection from "../config/DB.js";

class User {
  // Crear un nuevo usuario
  static async create(userData) {
    const sql = "INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)";
    const values = [userData.nombre, userData.email, userData.password];
    const [result] = await connection.query(sql, values);
    return result;
  }

  // Buscar usuario por email
  static async findByEmail(email) {
    const sql = "SELECT * FROM usuarios WHERE email = ?";
    const [results] = await connection.query(sql, [email]);
    return results[0];
  }

  // Buscar usuario por ID con su rol
  static async findById(id) {
    const sql = `
      SELECT u.idUsuario, u.nombre, u.email, r.nombre as role 
      FROM usuarios u
      LEFT JOIN roles r ON u.idUsuario = r.idUsuario
      WHERE u.idUsuario = ?
    `;
    const [results] = await connection.query(sql, [id]);
    return results[0];
  }

  // Obtener todos los usuarios (solo admin)
  static async getAll() {
    const sql = `
      SELECT u.idUsuario, u.nombre, u.email, r.nombre as role 
      FROM usuarios u
      LEFT JOIN roles r ON u.idUsuario = r.idUsuario
    `;
    const [results] = await connection.query(sql);
    return results;
  }

  // Actualizar usuario
  static async update(id, userData) {
    const sql = "UPDATE usuarios SET nombre = ?, email = ? WHERE idUsuario = ?";
    const values = [userData.nombre, userData.email, id];
    const [result] = await connection.query(sql, values);
    return result;
  }

  // Eliminar usuario
  static async delete(id) {
    const sql = "DELETE FROM usuarios WHERE idUsuario = ?";
    const [result] = await connection.query(sql, [id]);
    return result;
  }

  // Crear rol para un usuario
  static async createRole(idUsuario, roleName) {
    const sql = "INSERT INTO roles (idUsuario, nombre) VALUES (?, ?)";
    const [result] = await connection.query(sql, [idUsuario, roleName]);
    return result;
  }

  // Obtener rol de un usuario
  static async getRole(idUsuario) {
    const sql = "SELECT nombre FROM roles WHERE idUsuario = ?";
    const [results] = await connection.query(sql, [idUsuario]);
    return results[0];
  }
}

export default User;
