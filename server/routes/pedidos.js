import express from 'express';
import { 
  crearPedido, 
  obtenerPedidos, 
  obtenerDetallePedido,
  obtenerPedidosUsuario 
} from '../controllers/pedidoController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Crear un nuevo pedido (requiere autenticación)
router.post('/', authenticateToken, crearPedido);

// Obtener todos los pedidos (admin)
router.get('/', authenticateToken, obtenerPedidos);

// Obtener detalles de un pedido específico
router.get('/:id/detalle', authenticateToken, obtenerDetallePedido);

// Obtener pedidos de un usuario específico
router.get('/usuario/:idUsuario', authenticateToken, obtenerPedidosUsuario);

export default router;
