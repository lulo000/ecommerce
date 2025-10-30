import "../assets/css/StyleGeneral.css";

export default function NavBar({ onFilter, onSort }) {
  return (
    <nav className="navbar">
      <div className="filters">
        <button onClick={() => onFilter('entradas')}>Entradas</button>
        <button onClick={() => onFilter('principales')}>Platos Principales</button>
        <button onClick={() => onFilter('postres')}>Postres</button>
        <button onClick={() => onFilter('bebidas')}>Bebidas</button>
      </div>
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