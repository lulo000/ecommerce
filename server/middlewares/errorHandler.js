// server/middlewares/errorHandler.js

// Middleware global para manejo de errores
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: "Error de validación",
      details: err.message
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: "Token inválido"
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: "Token expirado"
    });
  }

  // Error genérico del servidor
  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor"
  });
};

// Middleware para rutas no encontradas
export const notFound = (req, res, next) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.originalUrl
  });
};
