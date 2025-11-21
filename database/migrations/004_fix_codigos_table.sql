-- Modificar la tabla codigos para agregar el campo descuento y cambiar el tipo de codigo

-- Primero eliminar la tabla si existe y recrearla con la estructura correcta
DROP TABLE IF EXISTS `codigos`;

CREATE TABLE `codigos` (
  `idCodigo` INT(11) NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(50) NOT NULL UNIQUE,
  `descuento` DECIMAL(5,2) NOT NULL,
  PRIMARY KEY (`idCodigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insertar algunos códigos de ejemplo
INSERT INTO `codigos` (`codigo`, `descuento`) VALUES
('PIZZA10', 10.00),
('PIZZA20', 20.00),
('VERANO2025', 15.00),
('PROMO50', 50.00);
