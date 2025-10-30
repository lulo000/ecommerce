import Header from '../components/Header';
import NavBar from '../components/NavBar';
import { useState } from 'react';

export default function Home() {
  const [cartCount, setCartCount] = useState(2); // ejemplo
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');

  return (
    <>
      <Header cartCount={cartCount} />
      <NavBar onFilter={setFilter} onSort={setSort} />
      {/* Aquí iría tu lista de productos filtrados y ordenados */}
    </>
  );
}