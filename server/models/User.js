// server/models/User.js
import connection from "../config/DB.js";

class User {
  // Crear un nuevo usuario
  static create(userData, callback) {
    const sql = "INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)";
    const values = [userData.nombre, userData.email, userData.password];
    connection.query(sql, values, callback);
  }

  // Buscar usuario por email
  static findByEmail(email, callback) {
    const sql = "SELECT * FROM usuarios WHERE email = ?";
    connection.query(sql, [email], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }

  // Buscar usuario por ID con su rol
  static findById(id, callback) {
    const sql = `
      SELECT u.idUsuario, u.nombre, u.email, r.nombre as role 
      FROM usuarios u
      LEFT JOIN roles r ON u.idUsuario = r.idUsuario
      WHERE u.idUsuario = ?
    `;
    connection.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }

  // Obtener todos los usuarios (solo admin)
  static getAll(callback) {
    const sql = `
      SELECT u.idUsuario, u.nombre, u.email, r.nombre as role 
      FROM usuarios u
      LEFT JOIN roles r ON u.idUsuario = r.idUsuario
    `;
    connection.query(sql, callback);
  }

  // Actualizar usuario
  static update(id, userData, callback) {
    const sql = "UPDATE usuarios SET nombre = ?, email = ? WHERE idUsuario = ?";
    const values = [userData.nombre, userData.email, id];
    connection.query(sql, values, callback);
  }

  // Eliminar usuario
  static delete(id, callback) {
    const sql = "DELETE FROM usuarios WHERE idUsuario = ?";
    connection.query(sql, [id], callback);
  }

  // Crear rol para un usuario
  static createRole(idUsuario, roleName, callback) {
    const sql = "INSERT INTO roles (idUsuario, nombre) VALUES (?, ?)";
    connection.query(sql, [idUsuario, roleName], callback);
  }

  // Obtener rol de un usuario
  static getRole(idUsuario, callback) {
    const sql = "SELECT nombre FROM roles WHERE idUsuario = ?";
    connection.query(sql, [idUsuario], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }
}

export default User;
