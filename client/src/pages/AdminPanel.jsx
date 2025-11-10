// client/src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../assets/css/StyleGeneral.css';

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('productos');
  
  // Verificar que sea admin con email específico
  useEffect(() => {
    if (!user || user.email !== 'admin@gmail.com') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.email !== 'admin@gmail.com') {
    return null;
  }

  return (
    <>
      <Header />
      <div className="admin-container">
        <div className="admin-card">
          {/* Header del panel */}
          <div className="admin-header">
            <h1>Panel de Administración</h1>
            <p>Gestión completa del e-commerce</p>
          </div>

          {/* Tabs de navegación */}
          <div className="admin-tabs">
            <button
              onClick={() => setActiveTab('productos')}
              className={`admin-tab ${activeTab === 'productos' ? 'active' : ''}`}
            >
              📦 Productos
            </button>
            <button
              onClick={() => setActiveTab('categorias')}
              className={`admin-tab ${activeTab === 'categorias' ? 'active' : ''}`}
            >
              📁 Categorías
            </button>
            <button
              onClick={() => setActiveTab('pedidos')}
              className={`admin-tab ${activeTab === 'pedidos' ? 'active' : ''}`}
            >
              🛍️ Pedidos
            </button>
          </div>

          {/* Contenido de las tabs */}
          <div className="admin-content">
            {activeTab === 'productos' && <ProductosAdmin />}
            {activeTab === 'categorias' && <CategoriasAdmin />}
            {activeTab === 'pedidos' && <PedidosAdmin />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

// Componente para gestión de productos
function ProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    urlImg: '',
    idCategoria: ''
  });

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/productos');
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    }
  };

  const cargarCategorias = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categorias');
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      alert('No estás autenticado. Por favor inicia sesión.');
      return;
    }
    
    try {
      const url = editingProduct 
        ? `http://localhost:5000/api/productos/${editingProduct.idProducto}`
        : 'http://localhost:5000/api/productos';
      
      console.log('Enviando:', { url, method: editingProduct ? 'PUT' : 'POST', data: formData });
      
      const res = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const responseData = await res.json();
      console.log('Respuesta del servidor:', responseData);

      if (res.ok) {
        alert(editingProduct ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
        setShowForm(false);
        setEditingProduct(null);
        setFormData({ nombre: '', descripcion: '', precio: '', urlImg: '', idCategoria: '' });
        cargarProductos();
      } else {
        alert(`Error: ${responseData.error || 'Error al guardar el producto'}`);
      }
    } catch (err) {
      console.error('Error en handleSubmit:', err);
      alert('Error de conexión con el servidor');
    }
  };

  const handleEdit = (producto) => {
    setEditingProduct(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      urlImg: producto.urlImg || '',
      idCategoria: producto.idCategoria
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      alert('No estás autenticado. Por favor inicia sesión.');
      return;
    }
    
    try {
      console.log('Eliminando producto:', id);
      
      const res = await fetch(`http://localhost:5000/api/productos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const responseData = await res.json();
      console.log('Respuesta del servidor:', responseData);

      if (res.ok) {
        alert('Producto eliminado exitosamente');
        cargarProductos();
      } else {
        alert(`Error: ${responseData.error || 'Error al eliminar'}`);
      }
    } catch (err) {
      console.error('Error en handleDelete:', err);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h2>Gestión de Productos</h2>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            setEditingProduct(null);
            setFormData({ nombre: '', descripcion: '', precio: '', urlImg: '', idCategoria: '' });
          }}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {showForm ? <><i className="fa-solid fa-xmark"></i> </> : <><i className="fa-solid fa-plus"></i></>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{background: '#f8f8f8', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem'}}>
          <h3>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <div style={{display: 'grid', gap: '1rem'}}>
            <input
              type="text"
              placeholder="Nombre del producto"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              required
              style={{padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px'}}
            />
            <textarea
              placeholder="Descripción"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              rows={3}
              style={{padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px'}}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Precio"
              value={formData.precio}
              onChange={(e) => setFormData({...formData, precio: e.target.value})}
              required
              style={{padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px'}}
            />
            <input
              type="text"
              placeholder="URL de la imagen"
              value={formData.urlImg}
              onChange={(e) => setFormData({...formData, urlImg: e.target.value})}
              style={{padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px'}}
            />
            <select
              value={formData.idCategoria}
              onChange={(e) => setFormData({...formData, idCategoria: e.target.value})}
              required
              style={{padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px'}}
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map(cat => (
                <option key={cat.idCategoria} value={cat.idCategoria}>{cat.nombre}</option>
              ))}
            </select>
            <button type="submit" style={{padding: '0.75rem', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600'}}>
              {editingProduct ? 'Actualizar' : 'Crear'} Producto
            </button>
          </div>
        </form>
      )}

      <div style={{overflow: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{background: '#f8f8f8', borderBottom: '2px solid #ddd'}}>
              <th style={{padding: '1rem', textAlign: 'left'}}>Imagen</th>
              <th style={{padding: '1rem', textAlign: 'left'}}>Nombre</th>
              <th style={{padding: '1rem', textAlign: 'left'}}>Precio</th>
              <th style={{padding: '1rem', textAlign: 'left'}}>Categoría</th>
              <th style={{padding: '1rem', textAlign: 'center'}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(prod => (
              <tr key={prod.idProducto} style={{borderBottom: '1px solid #eee'}}>
                <td style={{padding: '0.75rem'}}>
                  <img src={prod.urlImg} alt={prod.nombre} style={{width: 60, height: 60, objectFit: 'cover', borderRadius: '4px'}} />
                </td>
                <td style={{padding: '0.75rem'}}>{prod.nombre}</td>
                <td style={{padding: '0.75rem', fontWeight: '700'}}>${prod.precio}</td>
                <td style={{padding: '0.75rem'}}>{prod.idCategoria}</td>
                <td style={{padding: '0.75rem', textAlign: 'center'}}>
                  <button onClick={() => handleEdit(prod)} className="btn-edit" aria-label="Editar producto">
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button onClick={() => handleDelete(prod.idProducto)} className="btn-delete" aria-label="Eliminar producto">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente para gestión de categorías
function CategoriasAdmin() {
  const [categorias, setCategorias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ nombre: '' });

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categorias');
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');
    
    try {
      const url = editingCategory 
        ? `http://localhost:5000/api/categorias/${editingCategory.idCategoria}`
        : 'http://localhost:5000/api/categorias';
      
      const res = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert(editingCategory ? 'Categoría actualizada' : 'Categoría creada');
        setShowForm(false);
        setEditingCategory(null);
        setFormData({ nombre: '' });
        cargarCategorias();
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  const handleEdit = (categoria) => {
    setEditingCategory(categoria);
    setFormData({ nombre: categoria.nombre });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar categoría?')) return;
    
    const token = localStorage.getItem('auth_token');
    try {
      const res = await fetch(`http://localhost:5000/api/categorias/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        alert('Categoría eliminada');
        cargarCategorias();
      }
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h2>Gestión de Categorías</h2>
        <button 
          onClick={() => { 
            setShowForm(!showForm); 
            setEditingCategory(null); 
            setFormData({ nombre: '' }); 
          }} 
          style={{
            padding: '0.75rem 1.5rem',
            background: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {showForm ? <><i className="fa-solid fa-xmark"></i> </> : <><i className="fa-solid fa-plus"></i></>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{background: '#f8f8f8', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem'}}>
          <div style={{display: 'grid', gap: '1rem'}}>
            <input type="text" placeholder="Nombre de la categoría" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required style={{padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px'}} />
            <button type="submit" style={{padding: '0.75rem', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600'}}>
              {editingCategory ? 'Actualizar' : 'Crear'} Categoría
            </button>
          </div>
        </form>
      )}

      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr style={{background: '#f8f8f8', borderBottom: '2px solid #ddd'}}>
            <th style={{padding: '1rem', textAlign: 'left'}}>ID</th>
            <th style={{padding: '1rem', textAlign: 'left'}}>Nombre</th>
            <th style={{padding: '1rem', textAlign: 'center'}}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(cat => (
            <tr key={cat.idCategoria} style={{borderBottom: '1px solid #eee'}}>
              <td style={{padding: '0.75rem'}}>{cat.idCategoria}</td>
              <td style={{padding: '0.75rem', fontWeight: '600'}}>{cat.nombre}</td>
              <td style={{padding: '0.75rem', textAlign: 'center'}}>
                <button onClick={() => handleEdit(cat)} className="btn-edit" aria-label="Editar categoría">
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button onClick={() => handleDelete(cat.idCategoria)} className="btn-delete" aria-label="Eliminar categoría">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Componente para gestión de pedidos (placeholder)
function PedidosAdmin() {
  return (
    <div>
      <h2>Gestión de Pedidos</h2>
      <p style={{color: '#666', marginTop: '1rem'}}>
        Esta sección estará disponible próximamente para gestionar los pedidos de los clientes.
      </p>
    </div>
  );
}
