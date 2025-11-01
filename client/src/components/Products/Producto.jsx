import React from "react";

const ProductCard = ({ producto, onAddToCart }) => {
  return (
    <div className="tarjeta">
      <img src={producto.imagen} alt={producto.nombre} />
      <h3>{producto.nombre}</h3>
      <p className="precio">${producto.precio}</p>
      <button className="btn-carrito" onClick={() => onAddToCart(producto)}>
        Añadir al carrito
      </button>
    </div>
  );
};

export default ProductCard;
