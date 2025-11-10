import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simular verificación inicial de autenticación
  React.useEffect(() => {
    // Aquí verificarías el token almacenado y validarías con el backend
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Verificar token con el backend
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Error validando token:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) throw new Error('Credenciales inválidas');

      const data = await response.json();
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error('Error en registro');

      const data = await response.json();
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Error en registro:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    // Limpiar datos del carrito
    localStorage.removeItem('cart');
    localStorage.removeItem('diners');
    localStorage.removeItem('numberOfPeople');
    localStorage.removeItem('appliedDiscount');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}