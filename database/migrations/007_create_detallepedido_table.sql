-- Crear tabla detallepedido
CREATE TABLE IF NOT EXISTS detallepedido (
    idDetalle INT AUTO_INCREMENT PRIMARY KEY,
    idPedido INT NOT NULL,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (idPedido) REFERENCES pedidos(idPedido) ON DELETE CASCADE,
    FOREIGN KEY (idProducto) REFERENCES productos(idProducto) ON DELETE CASCADE
);