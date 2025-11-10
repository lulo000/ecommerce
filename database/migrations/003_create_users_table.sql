-- Script para crear la tabla de usuarios
USE ecommerce;

-- Crear tabla de usuarios si no existe
CREATE TABLE IF NOT EXISTS usuarios (
  idUsuario INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear un usuario administrador por defecto (contraseña: admin123)
-- La contraseña está hasheada con bcrypt
INSERT INTO usuarios (nombre, email, password, role) VALUES 
('Administrador', 'admin@ecommerce.com', '$2a$10$8Z9XKZnH4Q9zY5pX7N2wI.vKJyZ5YGwK6YBqXZLQ7JxN5zQ7zQ7z.', 'admin')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Verificar usuarios creados
SELECT idUsuario, nombre, email, role FROM usuarios;
