// server/routes/codigos.js
import express from 'express';
import {
  getAllCodigos,
  getCodigoById,
  validateCodigo,
  createCodigo,
  updateCodigo,
  deleteCodigo
} from '../controllers/codigoController.js';
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/validate/:codigo', validateCodigo); // Validar código (para usuarios)

// Rutas protegidas (solo admin)
router.get('/', authenticateToken, isAdmin, getAllCodigos);
router.get('/:id', authenticateToken, isAdmin, getCodigoById);
router.post('/', authenticateToken, isAdmin, createCodigo);
router.put('/:id', authenticateToken, isAdmin, updateCodigo);
router.delete('/:id', authenticateToken, isAdmin, deleteCodigo);

export default router;
