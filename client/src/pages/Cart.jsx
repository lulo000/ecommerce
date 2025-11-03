import React from 'react';
import { useCart } from '../context/CartContext';
import '../assets/css/StyleGeneral.css';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, getTotal, totalItemLimit, currentTotalItems } = useCart();

  return (
    <div className="cart-page" style={{maxWidth: 900, margin: '2rem auto', padding: '0 1rem'}}>
      <h2>Tu Carrito</h2>

      {cart.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          <div className="cart-list">
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
                <button onClick={()=> removeFromCart(item.id)} className="product-card-button" style={{padding:'0.4rem 0.6rem'}}>Eliminar</button>
              </div>
            ))}
          </div>

          <div className="cart-summary" style={{textAlign:'right', marginTop:'1rem'}}>
            <div style={{color:'#666'}}>Items: {currentTotalItems} / Límite: {totalItemLimit}</div>
            <div style={{fontSize:'1.4rem', fontWeight:800, marginTop:'0.5rem'}}>Subtotal: ${getTotal().toFixed(2)}</div>
          </div>
        </>
      )}
    </div>
  );
}
