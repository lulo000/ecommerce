import Header from '../components/Header';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import { useState } from 'react';
import pizzaImg from '../assets/img/Pizza.png';

export default function Home() {
  const [cartCount, setCartCount] = useState(2); // ejemplo
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');

  return (
    <>
      <Header cartCount={cartCount} />
      <NavBar onFilter={setFilter} onSort={setSort} />
      <div className="homeImg">
        <img src={pizzaImg} alt="pizza" />
      </div>
      <Menu filter={filter} sort={sort} />
      {/* Aquí iría tu lista de productos filtrados y ordenados */}
      <Footer />
    </>
  );
}