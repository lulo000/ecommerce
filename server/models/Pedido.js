import connection from '../config/DB.js';

export default class Pedido {
  // Crear un nuevo pedido completo (pedido + detalles)
  static async crearPedido(pedidoData) {
    const conn = await connection.getConnection();
    
    try {
      await conn.beginTransaction();

      // 1. Validar stock disponible
      const errores = [];
      for (const item of pedidoData.productos) {
        const [rows] = await conn.query(
          'SELECT nombre, stock FROM productos WHERE idProducto = ?',
          [item.idProducto]
        );
        
        if (rows.length === 0) {
          errores.push(`Producto ID ${item.idProducto} no encontrado`);
        } else if (rows[0].stock < item.cantidad) {
          errores.push(`Stock insuficiente para ${rows[0].nombre}. Disponible: ${rows[0].stock}, Solicitado: ${item.cantidad}`);
        }
      }
      
      if (errores.length > 0) {
        throw new Error(errores.join(', '));
      }

      // 2. Insertar en tabla pedidos
      const [resultPedido] = await conn.query(
        `INSERT INTO pedidos (idUsuario, mesa, cantidadClientes, fechaPedido) 
         VALUES (?, ?, ?, NOW())`,
        [pedidoData.idUsuario, pedidoData.mesa, pedidoData.cantidadClientes]
      );

      const idPedido = resultPedido.insertId;

      // 3. Insertar cada producto en detallepedido y reducir stock
      for (const item of pedidoData.productos) {
        // Insertar detalle
        await conn.query(
          `INSERT INTO detallepedido (idPedido, idProducto, cantidad) 
           VALUES (?, ?, ?)`,
          [idPedido, item.idProducto, item.cantidad]
        );
        
        // Reducir stock
        await conn.query(
          `UPDATE productos 
           SET stock = stock - ? 
           WHERE idProducto = ?`,
          [item.cantidad, item.idProducto]
        );
      }

      await conn.commit();
      return { success: true, idPedido };

    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  // Obtener todos los pedidos con detalles
  static async obtenerTodos() {
    const [rows] = await connection.query(
      `SELECT 
        p.idPedido,
        p.idUsuario,
        u.nombre as nombreUsuario,
        u.email,
        p.mesa,
        p.cantidadClientes,
        p.fechaPedido
       FROM pedidos p
       LEFT JOIN usuarios u ON p.idUsuario = u.idUsuario
       ORDER BY p.fechaPedido DESC`
    );
    return rows;
  }

  // Obtener detalles de un pedido específico
  static async obtenerDetalle(idPedido) {
    const [rows] = await connection.query(
      `SELECT 
        d.idDetalle,
        d.idPedido,
        d.idProducto,
        d.cantidad,
        pr.nombre as nombreProducto,
        pr.precio
       FROM detallepedido d
       INNER JOIN productos pr ON d.idProducto = pr.idProducto
       WHERE d.idPedido = ?`,
      [idPedido]
    );
    return rows;
  }

  // Obtener pedidos de un usuario específico
  static async obtenerPorUsuario(idUsuario) {
    const [rows] = await connection.query(
      `SELECT * FROM pedidos WHERE idUsuario = ? ORDER BY fechaPedido DESC`,
      [idUsuario]
    );
    return rows;
  }
}
