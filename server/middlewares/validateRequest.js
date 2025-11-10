// server/middlewares/validateRequest.js

// Middleware para validar datos de registro
export const validateRegister = (req, res, next) => {
  const { nombre, email, password } = req.body;

  if (!nombre || nombre.trim().length < 2) {
    return res.status(400).json({ error: "El nombre debe tener al menos 2 caracteres" });
  }

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }

  next();
};

// Middleware para validar datos de login
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  if (!password) {
    return res.status(400).json({ error: "Contraseña requerida" });
  }

  next();
};

// Middleware para validar datos de producto
export const validateProduct = (req, res, next) => {
  const { nombre, precio, idCategoria } = req.body;

  if (!nombre || nombre.trim().length < 2) {
    return res.status(400).json({ error: "El nombre del producto es requerido" });
  }

  if (!precio || isNaN(precio) || precio <= 0) {
    return res.status(400).json({ error: "El precio debe ser un número positivo" });
  }

  if (!idCategoria || isNaN(idCategoria)) {
    return res.status(400).json({ error: "ID de categoría inválido" });
  }

  next();
};

// Middleware para validar datos de categoría
export const validateCategory = (req, res, next) => {
  const { nombre } = req.body;

  if (!nombre || nombre.trim().length < 2) {
    return res.status(400).json({ error: "El nombre de la categoría es requerido" });
  }

  next();
};

// Función auxiliar para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
