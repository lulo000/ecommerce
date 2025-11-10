import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Register() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await register(form);
      if (success) {
        navigate('/');
      } else {
        setError('Error al crear la cuenta. El email puede estar registrado.');
      }
    } catch (err) {
      setError('Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div style={{maxWidth: '400px', margin: '3rem auto', padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <h2 style={{textAlign: 'center', marginBottom: '1rem'}}>Crear cuenta</h2>
          
          {error && (
            <div style={{background: '#fee', color: '#c33', padding: '0.75rem', borderRadius: '4px', fontSize: '0.9rem'}}>
              {error}
            </div>
          )}

          <div style={{display: 'flex', flexDirection: 'column', gap: '0.3rem'}}>
            <label htmlFor="nombre" style={{fontWeight: '600', fontSize: '0.9rem'}}>Nombre completo</label>
            <input 
              id="nombre"
              name="nombre" 
              type="text"
              placeholder="Tu nombre" 
              value={form.nombre}
              onChange={handleChange} 
              required 
              style={{padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem'}}
            />
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '0.3rem'}}>
            <label htmlFor="email" style={{fontWeight: '600', fontSize: '0.9rem'}}>Email</label>
            <input 
              id="email"
              name="email" 
              type="email" 
              placeholder="tu@email.com" 
              value={form.email}
              onChange={handleChange} 
              required 
              style={{padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem'}}
            />
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '0.3rem'}}>
            <label htmlFor="password" style={{fontWeight: '600', fontSize: '0.9rem'}}>Contraseña</label>
            <input 
              id="password"
              name="password" 
              type="password" 
              placeholder="Mínimo 6 caracteres" 
              value={form.password}
              onChange={handleChange} 
              required 
              minLength={6}
              style={{padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem'}}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem',
              background: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <p style={{textAlign: 'center', fontSize: '0.9rem', marginTop: '0.5rem'}}>
            ¿Ya tienes cuenta? <Link to="/login" style={{color: '#27ae60', fontWeight: '600'}}>Inicia sesión</Link>
          </p>

          <Link to="/" style={{textAlign: 'center', color: '#666', fontSize: '0.9rem', textDecoration: 'none'}}>
            ← Volver al inicio
          </Link>
        </form>
      </div>
      <Footer />
    </>
  );
}