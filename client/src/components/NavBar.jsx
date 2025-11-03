import React, { useState, useEffect } from "react";
import "../assets/css/StyleGeneral.css";

export default function NavBar({ onFilter, onSort, onSearch }) {
  const [query, setQuery] = useState("");
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // Carga las categorías desde el backend
    fetch("http://localhost:5000/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error al obtener categorías:", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <nav className="navbar">
      <div className="filters">
        <button onClick={() => onFilter("__ALL__")}>
          Ver todo
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.idCategoria}
            onClick={() => onFilter(cat.nombre)}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      <form className="search-bar" onSubmit={handleSearch} role="search">
        <input
          className="search-input"
          type="text"
          placeholder="Buscar productos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar productos"
        />
        <button className="search-button" type="submit">
          Buscar
        </button>
      </form>

      <div className="sort">
        <select onChange={(e) => onSort(e.target.value)}>
          <option value="">Ordenar por precio</option>
          <option value="asc">Menor a mayor</option>
          <option value="desc">Mayor a menor</option>
        </select>
      </div>
    </nav>
  );
}
