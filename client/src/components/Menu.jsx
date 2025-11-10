import React, { useState, useEffect } from "react";
import "../assets/css/StyleGeneral.css";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Menu({ selectedCategory, sortOrder, searchQuery }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [showFullCard, setShowFullCard] = useState(false);
  const { addToCart, currentTotalItems, totalItemLimit, isFull } = useCart();

  useEffect(() => {
    setLoading(true);

    // URL base del endpoint
    let url = "http://localhost:5000/api/productos";

    // Si hay categoría seleccionada y no es "ver todo", usar el endpoint correspondiente
    if (selectedCategory && selectedCategory !== "__ALL__") {
      url = `http://localhost:5000/api/productos/categoria/nombre/${selectedCategory}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let filteredData = data;

        // Filtro por búsqueda
        if (searchQuery) {
          filteredData = filteredData.filter((prod) =>
            prod.nombre.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Orden por precio
        if (sortOrder === "asc") {
          filteredData.sort((a, b) => a.precio - b.precio);
        } else if (sortOrder === "desc") {
          filteredData.sort((a, b) => b.precio - a.precio);
        }

        setProductos(filteredData);
      })
      .catch((err) => {
        console.error("Error al obtener productos:", err);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, sortOrder, searchQuery]);

  if (loading) {
    return (
      <div className="menu">
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="menu">
      <h2>
        Productos {selectedCategory && selectedCategory !== "__ALL__" ? `- ${selectedCategory}` : ""}
      </h2>
      {productos.length === 0 ? (
        <p>No se encontraron productos</p>
      ) : (
        <div className="product-grid">
          {productos.map((prod) => {
            const imageSrc = prod.urlImg || prod.imagen || prod.imageUrl || prod.image || "https://via.placeholder.com/600x400?text=Sin+imagen";
            const normalized = {
              id: prod.idProducto ?? prod.id ?? prod.productId ?? prod.codigo,
              name: prod.nombre,
              price: Number(prod.precio),
              image: imageSrc,
            };

            const handleAdd = () => {
              const willBe = currentTotalItems + 1;
              const ok = addToCart(normalized, 1);
              if (ok) {
                setToast(`${normalized.name} agregado al carrito`);
                setTimeout(() => setToast(""), 1500);
                if (willBe >= totalItemLimit) setShowFullCard(true);
              } else if (isFull || currentTotalItems >= totalItemLimit) {
                setShowFullCard(true);
              }
            };

            return (
              <div key={normalized.id} className="product-card">
                <img
                  src={imageSrc}
                  alt={prod.nombre}
                  className="product-card-image"
                  loading="lazy"
                  decoding="async"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/600x400?text=Imagen+no+disponible";
                  }}
                />
                <div className="product-card-content">
                  <h3 className="product-card-title">{prod.nombre}</h3>
                  {prod.descripcion && (
                    <p className="product-card-description">{prod.descripcion}</p>
                  )}
                  <p className="product-card-price">${prod.precio}</p>
                  <button className="product-card-button" onClick={handleAdd}>Añadir al carrito</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
      {showFullCard && (
        <div className="cart-full-card" role="dialog" aria-live="polite">
          <h3>Carrito lleno</h3>
          <p>Has alcanzado el límite de {totalItemLimit} artículos.</p>
          <div className="cart-full-actions">
            <Link to="/cart" className="cart-full-button">Ver carrito</Link>
          </div>
        </div>
      )}
    </div>
  );
}
