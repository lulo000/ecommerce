import React, { useEffect, useState } from "react";
import ProductCard from "./Producto";

const ProductList = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Ejemplo: obtener productos desde la API
    fetch("http://localhost:5000/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  const handleAddToCart = (producto) => {
    console.log("Agregado al carrito:", producto);
    // Lógica para añadir al carrito
  };

  return (
    <div className="tarjetas">
      {productos.map((p) => (
        <ProductCard key={p.id} producto={p} onAddToCart={handleAddToCart} />
      ))}
    </div>
  );
};

export default ProductList;
