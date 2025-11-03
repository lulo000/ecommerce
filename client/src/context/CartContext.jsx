import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [diners, setDiners] = useState(1); // Número de comensales
  const maxItemsPerDiner = 4;

  // Calcular el límite total de items basado en el número de comensales
  const totalItemLimit = diners * maxItemsPerDiner;

  // Obtener el total de items actuales en el carrito
  const currentTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Verificar si se puede agregar más items al carrito
  const canAddToCart = (quantity = 1) => {
    return currentTotalItems + quantity <= totalItemLimit;
  };

  // Agregar un producto al carrito
  const addToCart = (product, quantity = 1) => {
    if (!canAddToCart(quantity)) {
      return false;
    }

    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Actualizar cantidad si el producto ya existe
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      // Agregar nuevo producto
      return [...currentCart, { ...product, quantity }];
    });

    return true;
  };

  // Remover un producto del carrito
  const removeFromCart = (productId) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    // Calcular el nuevo total después del cambio
    const newTotalItems = cart.reduce((sum, item) => {
      if (item.id === productId) {
        return sum + quantity;
      }
      return sum + item.quantity;
    }, 0);

    if (newTotalItems > totalItemLimit) {
      return;
    }

    setCart(currentCart =>
      currentCart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Actualizar número de comensales
  const updateDiners = (number) => {
    if (number < 1) return;
    setDiners(number);
  };

  // Limpiar carrito
  const clearCart = () => {
    setCart([]);
  };

  // Calcular total del carrito
  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cart,
    diners,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateDiners,
    clearCart,
    getTotal,
    maxItemsPerDiner,
    currentTotalItems,
    totalItemLimit,
    canAddToCart,
    isFull: currentTotalItems >= totalItemLimit
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}