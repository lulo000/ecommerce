-- Crear tabla pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    idPedido INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    mesa INT NOT NULL,
    cantidadClientes INT NOT NULL,
    fechaPedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario) ON DELETE CASCADE
);