// server/models/Codigo.js
import connection from '../config/DB.js';

const Codigo = {
  // Obtener todos los códigos
  getAll: async () => {
    const query = 'SELECT * FROM codigos ORDER BY idCodigo DESC';
    const [results] = await connection.query(query);
    return results;
  },

  // Obtener código por ID
  getById: async (id) => {
    const query = 'SELECT * FROM codigos WHERE idCodigo = ?';
    const [results] = await connection.query(query, [id]);
    return results;
  },

  // Obtener código por nombre
  getByCode: async (codigo) => {
    const query = 'SELECT * FROM codigos WHERE codigo = ?';
    const [results] = await connection.query(query, [codigo]);
    return results;
  },

  // Crear nuevo código
  create: async (codigoData) => {
    const query = 'INSERT INTO codigos (codigo, descuento) VALUES (?, ?)';
    const [result] = await connection.query(query, [codigoData.codigo, codigoData.descuento]);
    return result;
  },

  // Actualizar código
  update: async (id, codigoData) => {
    const query = 'UPDATE codigos SET codigo = ?, descuento = ? WHERE idCodigo = ?';
    const [result] = await connection.query(query, [codigoData.codigo, codigoData.descuento, id]);
    return result;
  },

  // Eliminar código
  delete: async (id) => {
    const query = 'DELETE FROM codigos WHERE idCodigo = ?';
    const [result] = await connection.query(query, [id]);
    return result;
  }
};

export default Codigo;
