// server/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

// Middleware para verificar token JWT
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key_default");
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};

// Middleware para verificar que el usuario sea admin
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  // Permitir si el rol es 'admin' o si el email es admin@gmail.com
  if (req.user.role !== 'admin' && req.user.email !== 'admin@gmail.com') {
    return res.status(403).json({ error: "Acceso denegado. Se requiere rol de administrador." });
  }

  next();
};

// Middleware opcional: verificar token si existe, pero no bloquear si no hay
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key_default");
      req.user = decoded;
    } catch (error) {
      // Token inválido, pero continuamos sin user
      req.user = null;
    }
  }

  next();
};
