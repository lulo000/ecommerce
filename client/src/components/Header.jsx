import '../assets/css/Header.css';
import logo from '../assets/img/logo1.png';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Header() {
  const { currentTotalItems } = useCart();
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Trattoria logo" />
      </div>
      <div className="cart">
        <Link to="/cart" className="cart-link" aria-label="Ver carrito">
          🛒 <span className="cart-count">{currentTotalItems}</span>
        </Link>
      </div>
    </header>
  );
}