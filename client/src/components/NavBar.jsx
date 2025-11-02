import React, { useState } from "react";
import "../assets/css/StyleGeneral.css";

export default function NavBar({ onFilter, onSort, onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <nav className="navbar">
      <div className="filters">
        <button onClick={() => onFilter("entradas")}>Entradas</button>
        <button onClick={() => onFilter("principales")}>Platos Principales</button>
        <button onClick={() => onFilter("postres")}>Postres</button>
        <button onClick={() => onFilter("bebidas")}>Bebidas</button>
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
        <button className="search-button" type="submit">Buscar</button>
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