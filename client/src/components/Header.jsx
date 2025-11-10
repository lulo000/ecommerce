import '../assets/css/Header.css';
import logo from '../assets/img/logo1.png';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Header() {
  const { currentTotalItems } = useCart();
  const { user, logout } = useAuth();
  
  return (
    <header className="header">
      <div className="logo">
        <Link to="/"><img src={logo} alt="Trattoria logo" /></Link>
      </div>
      
      <div className="header-actions">
        {user ? (
          <>
            <span className="user-greeting">Hola, {user.nombre}</span>
            
            {/* Solo mostrar panel admin si es admin@gmail.com */}
            {user.email === 'admin@gmail.com' && (
              <Link to="/admin" className="admin-button">
                🔧 Panel Admin
              </Link>
            )}
            
            <button onClick={logout} className="logout-button">
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link to="/login" className="user-icon-link" aria-label="Iniciar sesión">
            <i className="fa-solid fa-user"></i>
          </Link>
        )}
        
        <Link to="/cart" className="cart-link" aria-label="Ver carrito">
          <span className="cart-icon">🛒</span>
          <span className="cart-count">{currentTotalItems}</span>
        </Link>
      </div>
    </header>
  );
}