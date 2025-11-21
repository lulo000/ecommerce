import Pedido from '../models/Pedido.js';

// Crear un nuevo pedido
export const crearPedido = async (req, res) => {
  try {
    const { idUsuario, mesa, cantidadClientes, productos } = req.body;

    // Validaciones
    if (!idUsuario || !mesa || !cantidadClientes || !productos || productos.length === 0) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Crear el pedido
    const resultado = await Pedido.crearPedido({
      idUsuario,
      mesa,
      cantidadClientes,
      productos
    });

    res.status(201).json({
      message: 'Pedido creado exitosamente',
      idPedido: resultado.idPedido
    });

  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error al procesar el pedido' });
  }
};

// Obtener todos los pedidos (para admin)
export const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.obtenerTodos();
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

// Obtener detalles de un pedido específico
export const obtenerDetallePedido = async (req, res) => {
  try {
    const { id } = req.params;
    const detalles = await Pedido.obtenerDetalle(id);
    
    if (detalles.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    res.json(detalles);
  } catch (error) {
    console.error('Error al obtener detalle:', error);
    res.status(500).json({ error: 'Error al obtener detalle del pedido' });
  }
};

// Obtener pedidos de un usuario
export const obtenerPedidosUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const pedidos = await Pedido.obtenerPorUsuario(idUsuario);
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos del usuario:', error);
    res.status(500).json({ error: 'Error al obtener pedidos del usuario' });
  }
};
