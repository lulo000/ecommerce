import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../assets/css/StyleGeneral.css';

// Códigos de descuento válidos
const DISCOUNT_CODES = {
  'PIZZA10': { percentage: 10, description: '10% de descuento' },
  'PIZZA20': { percentage: 20, description: '20% de descuento' },
  'VERANO2025': { percentage: 15, description: '15% de descuento' },
  'PROMO50': { percentage: 50, description: '50% de descuento' }
};

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, getTotal, totalItemLimit, currentTotalItems } = useCart();
  const navigate = useNavigate();
  
  // Estados
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  // Persistencia de datos del carrito
  useEffect(() => {
    const savedPeople = localStorage.getItem('numberOfPeople');
    const savedDiscount = localStorage.getItem('appliedDiscount');
    
    if (savedPeople) setNumberOfPeople(parseInt(savedPeople));
    if (savedDiscount) setAppliedDiscount(JSON.parse(savedDiscount));
  }, []);

  useEffect(() => {
    localStorage.setItem('numberOfPeople', numberOfPeople.toString());
  }, [numberOfPeople]);

  useEffect(() => {
    if (appliedDiscount) {
      localStorage.setItem('appliedDiscount', JSON.stringify(appliedDiscount));
    } else {
      localStorage.removeItem('appliedDiscount');
    }
  }, [appliedDiscount]);

  // Cálculos
  const subtotal = getTotal();
  const tax = subtotal * 0.10; // 10% de impuesto
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percentage) / 100 : 0;
  const total = subtotal + tax - discountAmount;

  // Aplicar código de descuento
  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    
    if (!code) {
      setDiscountError('Por favor ingresa un código');
      return;
    }

    if (DISCOUNT_CODES[code]) {
      setAppliedDiscount(DISCOUNT_CODES[code]);
      setDiscountError('');
      setDiscountCode('');
    } else {
      setDiscountError('Código inválido');
      setAppliedDiscount(null);
    }
  };

  // Remover descuento
  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    setDiscountError('');
  };

  // Finalizar compra
  const handleCheckout = () => {
    // Validaciones
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    if (numberOfPeople < 1) {
      alert('El número de personas debe ser al menos 1');
      return;
    }

    if (currentTotalItems > totalItemLimit) {
      alert(`El carrito excede el límite de ${totalItemLimit} artículos`);
      return;
    }

    // Mostrar resumen antes de proceder
    setShowSummary(true);
  };

  // Confirmar pedido
  const handleConfirmOrder = () => {
    // Aquí se puede redirigir a la página de pago
    alert('Pedido confirmado! Redirigiendo a la página de pago...');
    // navigate('/checkout'); // Descomentar cuando exista la página
    
    // Limpiar datos guardados
    localStorage.removeItem('numberOfPeople');
    localStorage.removeItem('appliedDiscount');
  };

  return (
    <>
      <Header />
      
      <div className="cart-page" style={{maxWidth: 900, margin: '2rem auto', padding: '0 1rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
          <button 
            onClick={() => navigate('/')} 
            className="product-card-button"
            style={{padding: '0.5rem 1rem'}}
          >
            ← Volver
          </button>
          <h2 style={{margin: 0}}>Tu Carrito</h2>
        </div>

        {cart.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          <>
            {/* Lista de productos */}
            <div className="cart-list" style={{marginBottom: '2rem'}}>
              {cart.map(item => (
                <div key={item.id} className="cart-item" style={{display:'grid', gridTemplateColumns:'80px 1fr auto auto auto', gap:'1rem', alignItems:'center', padding:'0.75rem 0', borderBottom:'1px solid #eee'}}>
                  <img src={item.image} alt={item.name} style={{width:80, height:60, objectFit:'cover', borderRadius:6}}/>
                  <div>
                    <div style={{fontWeight:700}}>{item.name}</div>
                    <div style={{color:'#666', fontSize:'0.9rem'}}>${item.price.toFixed(2)}</div>
                  </div>
                  <div>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e)=> updateQuantity(item.id, Number(e.target.value))}
                      style={{width:70, padding:'0.25rem'}}
                    />
                  </div>
                  <div style={{fontWeight:700}}>${(item.price * item.quantity).toFixed(2)}</div>
                  <button onClick={()=> removeFromCart(item.id)} className="btn-delete" aria-label="Eliminar producto">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>

            {/* Número de personas */}
            <div className="cart-section" style={{background: '#f8f8f8', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem'}}>
              <h3 style={{margin: '0 0 1rem 0'}}>Información de la Mesa</h3>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <label style={{fontWeight: '600'}}>Número de personas:</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                  style={{width: '80px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd'}}
                />
              </div>
            </div>

            {/* Código de descuento */}
            <div className="cart-section" style={{background: '#f8f8f8', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem'}}>
              <h3 style={{margin: '0 0 1rem 0'}}>Código de Descuento</h3>
              {!appliedDiscount ? (
                <div>
                  <div style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem'}}>
                    <input
                      type="text"
                      placeholder="Ingresa tu código"
                      value={discountCode}
                      onChange={(e) => {
                        setDiscountCode(e.target.value);
                        setDiscountError('');
                      }}
                      style={{flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd'}}
                    />
                    <button 
                      onClick={handleApplyDiscount}
                      className="product-card-button"
                      style={{padding: '0.5rem 1.5rem'}}
                    >
                      Aplicar
                    </button>
                  </div>
                  {discountError && <div style={{color: '#e74c3c', fontSize: '0.9rem'}}>{discountError}</div>}
                  <div style={{fontSize: '0.85rem', color: '#666', marginTop: '0.5rem'}}>
                    Códigos disponibles: PIZZA10, PIZZA20, VERANO2025, PROMO50
                  </div>
                </div>
              ) : (
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#d4edda', padding: '1rem', borderRadius: '4px', border: '1px solid #c3e6cb'}}>
                  <div>
                    <div style={{fontWeight: '600', color: '#155724'}}>✓ Descuento aplicado</div>
                    <div style={{fontSize: '0.9rem', color: '#155724'}}>{appliedDiscount.description}</div>
                  </div>
                  <button 
                    onClick={handleRemoveDiscount}
                    style={{background: 'transparent', border: 'none', color: '#721c24', cursor: 'pointer', fontSize: '1.2rem'}}
                    aria-label="Remover descuento"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Resumen del pedido */}
            <div className="cart-summary" style={{background: '#f8f8f8', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem'}}>
              <h3 style={{margin: '0 0 1rem 0'}}>Resumen del Pedido</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span>Items ({currentTotalItems} / {totalItemLimit}):</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span>Impuestos (10%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {appliedDiscount && (
                  <div style={{display: 'flex', justifyContent: 'space-between', color: '#27ae60', fontWeight: '600'}}>
                    <span>Descuento ({appliedDiscount.percentage}%):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span>Personas:</span>
                  <span>{numberOfPeople}</span>
                </div>
                <div style={{borderTop: '2px solid #333', paddingTop: '0.5rem', marginTop: '0.5rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: '800'}}>
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div style={{fontSize: '0.85rem', color: '#666', textAlign: 'right'}}>
                    (${(total / numberOfPeople).toFixed(2)} por persona)
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de checkout */}
            <div style={{textAlign: 'center'}}>
              <button 
                onClick={handleCheckout}
                className="product-card-button"
                style={{
                  padding: '1rem 3rem',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  width: '100%',
                  maxWidth: '400px'
                }}
              >
                Finalizar Compra
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal de resumen final */}
      {showSummary && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{margin: '0 0 1.5rem 0'}}>Confirmación del Pedido</h2>
            
            <div style={{marginBottom: '1.5rem'}}>
              <h3>Productos:</h3>
              {cart.map(item => (
                <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee'}}>
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{marginBottom: '1.5rem', paddingTop: '1rem', borderTop: '2px solid #ddd'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <span>Impuestos (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {appliedDiscount && (
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#27ae60'}}>
                  <span>Descuento ({appliedDiscount.percentage}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <span>Número de personas:</span>
                <span>{numberOfPeople}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: '700', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #333'}}>
                <span>Total a Pagar:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{display: 'flex', gap: '1rem'}}>
              <button 
                onClick={() => setShowSummary(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmOrder}
                className="product-card-button"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  fontWeight: '600'
                }}
              >
                Confirmar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
