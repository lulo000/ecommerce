// server/controllers/codigoController.js
import Codigo from '../models/Codigo.js';

// Obtener todos los códigos
export const getAllCodigos = async (req, res) => {
  try {
    const results = await Codigo.getAll();
    res.json(results);
  } catch (err) {
    console.error('Error al obtener códigos:', err);
    res.status(500).json({ error: 'Error al obtener códigos' });
  }
};

// Obtener código por ID
export const getCodigoById = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await Codigo.getById(id);
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Código no encontrado' });
    }
    
    res.json(results[0]);
  } catch (err) {
    console.error('Error al obtener código:', err);
    res.status(500).json({ error: 'Error al obtener código' });
  }
};

// Validar código de descuento (para uso público)
export const validateCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const results = await Codigo.getByCode(codigo);
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Código inválido' });
    }
    
    res.json({
      valid: true,
      descuento: results[0].descuento,
      codigo: results[0].codigo
    });
  } catch (err) {
    console.error('Error al validar código:', err);
    res.status(500).json({ error: 'Error al validar código' });
  }
};

// Crear nuevo código
export const createCodigo = async (req, res) => {
  try {
    const { codigo, descuento } = req.body;
    
    // Validaciones
    if (!codigo || !descuento) {
      return res.status(400).json({ error: 'Código y descuento son requeridos' });
    }
    
    if (descuento < 0 || descuento > 100) {
      return res.status(400).json({ error: 'El descuento debe estar entre 0 y 100' });
    }
    
    // Verificar si el código ya existe
    const existing = await Codigo.getByCode(codigo.toUpperCase());
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'El código ya existe' });
    }
    
    // Crear el código
    const codigoData = {
      codigo: codigo.toUpperCase(),
      descuento: parseFloat(descuento)
    };
    
    const result = await Codigo.create(codigoData);
    
    res.status(201).json({
      message: 'Código creado exitosamente',
      idCodigo: result.insertId
    });
  } catch (err) {
    console.error('Error al crear código:', err);
    res.status(500).json({ error: 'Error al crear código' });
  }
};

// Actualizar código
export const updateCodigo = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, descuento } = req.body;
    
    // Validaciones
    if (!codigo || !descuento) {
      return res.status(400).json({ error: 'Código y descuento son requeridos' });
    }
    
    if (descuento < 0 || descuento > 100) {
      return res.status(400).json({ error: 'El descuento debe estar entre 0 y 100' });
    }
    
    const codigoData = {
      codigo: codigo.toUpperCase(),
      descuento: parseFloat(descuento)
    };
    
    const result = await Codigo.update(id, codigoData);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Código no encontrado' });
    }
    
    res.json({ message: 'Código actualizado exitosamente' });
  } catch (err) {
    console.error('Error al actualizar código:', err);
    res.status(500).json({ error: 'Error al actualizar código' });
  }
};

// Eliminar código
export const deleteCodigo = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Codigo.delete(id);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Código no encontrado' });
    }
    
    res.json({ message: 'Código eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar código:', err);
    res.status(500).json({ error: 'Error al eliminar código' });
  }
};
