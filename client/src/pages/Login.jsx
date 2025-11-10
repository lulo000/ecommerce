import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login({ email, password });
      if (success) {
        navigate('/');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div style={{maxWidth: '400px', margin: '3rem auto', padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <h2 style={{textAlign: 'center', marginBottom: '1rem'}}>Iniciar sesión</h2>
          
          {error && (
            <div style={{background: '#fee', color: '#c33', padding: '0.75rem', borderRadius: '4px', fontSize: '0.9rem'}}>
              {error}
            </div>
          )}

          <div style={{display: 'flex', flexDirection: 'column', gap: '0.3rem'}}>
            <label htmlFor="email" style={{fontWeight: '600', fontSize: '0.9rem'}}>Email</label>
            <input 
              id="email"
              type="email" 
              placeholder="tu@email.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={{padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem'}}
            />
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '0.3rem'}}>
            <label htmlFor="password" style={{fontWeight: '600', fontSize: '0.9rem'}}>Contraseña</label>
            <input 
              id="password"
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
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
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>

          <p style={{textAlign: 'center', fontSize: '0.9rem', marginTop: '0.5rem'}}>
            ¿No tienes cuenta? <Link to="/register" style={{color: '#27ae60', fontWeight: '600'}}>Regístrate</Link>
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