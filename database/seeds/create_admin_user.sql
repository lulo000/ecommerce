-- Script para crear usuario administrador
-- Ejecutar en tu base de datos ecommerce

USE ecommerce;

-- Verificar si el rol admin existe, si no, crearlo
INSERT IGNORE INTO roles (idRol, nombre) VALUES (1, 'admin');
INSERT IGNORE INTO roles (idRol, nombre) VALUES (2, 'user');

-- Crear usuario admin (la contraseña es: admin123)
-- El hash bcrypt es para la contraseña "admin123"
INSERT INTO usuarios (nombre, email, contraseña) 
VALUES ('Administrador', 'admin@gmail.com', '$2a$10$8Z9XKZnH4Q9zY5pX7N2wI.vKJyZ5YGwK6YBqXZLQ7JxN5zQ7zQ7z.')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Obtener el ID del usuario admin que acabamos de crear/verificar
SET @adminUserId = (SELECT idUsuario FROM usuarios WHERE email = 'admin@gmail.com');

-- Asignar rol de admin al usuario
INSERT INTO usuario_rol (idUsuario, idRol) 
VALUES (@adminUserId, 1)
ON DUPLICATE KEY UPDATE idRol=1;

-- Verificar que el usuario se creó correctamente
SELECT u.idUsuario, u.nombre, u.email, r.nombre as rol
FROM usuarios u
LEFT JOIN usuario_rol ur ON u.idUsuario = ur.idUsuario
LEFT JOIN roles r ON ur.idRol = r.idRol
WHERE u.email = 'admin@gmail.com';
