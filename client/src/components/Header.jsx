import '../assets/css/Header.css';
import logo from '../assets/img/logo1.png';

export default function Header({ cartCount }) {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Trattoria logo" />
      </div>
      <div className="cart">
        🛒 <span className="cart-count">{cartCount}</span>
      </div>
    </header>
  );
}