import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import { useState } from "react";
import pizzaImg from "../assets/img/Pizza.png";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilter = (categoriaNombre) => {
    // Si es 'Ver todo', alterna entre mostrar todo y ocultar
    if (categoriaNombre === "__ALL__") {
      setSelectedCategory((prev) => (prev === "__ALL__" ? null : "__ALL__"));
      return;
    }
    // Toggle normal por nombre de categoría
    setSelectedCategory((prev) => (prev === categoriaNombre ? null : categoriaNombre));
  };

  const handleSort = (orden) => {
    setSortOrder(orden);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <>
  <Header />
      <NavBar onFilter={handleFilter} onSort={handleSort} onSearch={handleSearch} />

      {selectedCategory && (
        <Menu 
          selectedCategory={selectedCategory} 
          sortOrder={sortOrder} 
          searchQuery={searchQuery} 
        />
      )}

      <div className="homeImg">
        <img src={pizzaImg} alt="pizza" />
      </div>
      <Footer />
    </>
  );
}
