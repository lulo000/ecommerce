// server/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Registrar nuevo usuario
export const register = async (req, res) => {
  try {
    const { nombre, email, password, role } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const userData = {
      nombre,
      email,
      password: hashedPassword
    };

    const result = await User.create(userData);
    const userId = result.insertId;
    const userRole = role || 'user';

    // Crear rol para el usuario
    try {
      await User.createRole(userId, userRole);
    } catch (errRole) {
      console.error("Error al crear rol:", errRole);
    }

    // Generar token
    const token = jwt.sign(
      { id: userId, email, role: userRole },
      process.env.JWT_SECRET || "secret_key_default",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: userId,
        nombre,
        email,
        role: userRole
      }
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Iniciar sesión
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }

    // Buscar usuario
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.contraseña);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Obtener el rol del usuario
    const roleData = await User.getRole(user.idUsuario);
    const userRole = roleData ? roleData.nombre : 'user';

    // Generar token
    const token = jwt.sign(
      { id: user.idUsuario, email: user.email, role: userRole },
      process.env.JWT_SECRET || "secret_key_default",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.idUsuario,
        nombre: user.nombre,
        email: user.email,
        role: userRole
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Validar token
export const validateToken = async (req, res) => {
  try {
    // El middleware de autenticación ya validó el token
    // Solo devolvemos los datos del usuario
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({
      id: user.idUsuario,
      nombre: user.nombre,
      email: user.email,
      role: user.role || 'user'
    });
  } catch (error) {
    console.error("Error en validateToken:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Obtener perfil del usuario autenticado
export const getProfile = (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({
      id: user.idUsuario,
      nombre: user.nombre,
      email: user.email,
      role: user.role || 'user'
    });
  });
};
