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
              Productos
            </button>
            <button
              onClick={() => setActiveTab('categorias')}
              className={`admin-tab ${activeTab === 'categorias' ? 'active' : ''}`}
            >
              Categorías
            </button>
            <button
              onClick={() => setActiveTab('codigos')}
              className={`admin-tab ${activeTab === 'codigos' ? 'active' : ''}`}
            >
              Códigos
            </button>
            <button
              onClick={() => setActiveTab('pedidos')}
              className={`admin-tab ${activeTab === 'pedidos' ? 'active' : ''}`}
            >
              Pedidos
            </button>
          </div>

          {/* Contenido de las tabs */}
          <div className="admin-content">
            {activeTab === 'productos' && <ProductosAdmin />}
            {activeTab === 'categorias' && <CategoriasAdmin />}
            {activeTab === 'codigos' && <CodigosAdmin />}
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
    }
  };

  const cargarCategorias = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categorias');
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      return;
    }
    
    try {
      const url = editingProduct 
        ? `http://localhost:5000/api/productos/${editingProduct.idProducto}`
        : 'http://localhost:5000/api/productos';
      
      const res = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const responseData = await res.json();

      if (res.ok) {
        setShowForm(false);
        setEditingProduct(null);
        setFormData({ nombre: '', descripcion: '', precio: '', urlImg: '', idCategoria: '' });
        cargarProductos();
      } else {
      }
    } catch (err) {
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
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:5000/api/productos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const responseData = await res.json();

      if (res.ok) {
        cargarProductos();
      } else {
      }
    } catch (err) {
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
              <th style={{padding: '1rem', textAlign: 'center'}}>Stock</th>
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
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    background: prod.stock > 10 ? '#d4edda' : prod.stock > 0 ? '#fff3cd' : '#f8d7da',
                    color: prod.stock > 10 ? '#155724' : prod.stock > 0 ? '#856404' : '#721c24',
                    fontWeight: '600'
                  }}>
                    {prod.stock || 0}
                  </span>
                </td>
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
        setShowForm(false);
        setEditingCategory(null);
        setFormData({ nombre: '' });
        cargarCategorias();
      }
    } catch (err) {
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
        cargarCategorias();
      }
    } catch (err) {
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

// Componente para gestión de códigos de descuento
function CodigosAdmin() {
  const [codigos, setCodigos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCodigo, setEditingCodigo] = useState(null);
  const [formData, setFormData] = useState({ codigo: '', descuento: '' });

  useEffect(() => {
    cargarCodigos();
  }, []);

  const cargarCodigos = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:5000/api/codigos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCodigos(data);
    } catch (err) {
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.codigo || !formData.descuento) {
      return;
    }

    if (formData.descuento < 0 || formData.descuento > 100) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const url = editingCodigo 
        ? `http://localhost:5000/api/codigos/${editingCodigo.idCodigo}`
        : 'http://localhost:5000/api/codigos';
      
      const method = editingCodigo ? 'PUT' : 'POST';
      
      // Convertir descuento a número
      const dataToSend = {
        codigo: formData.codigo,
        descuento: parseFloat(formData.descuento)
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return;
      }

      setShowForm(false);
      setEditingCodigo(null);
      setFormData({ codigo: '', descuento: '' });
      cargarCodigos();
    } catch (err) {
    }
  };

  const handleEdit = (codigo) => {
    setEditingCodigo(codigo);
    setFormData({ codigo: codigo.codigo, descuento: codigo.descuento });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este código?')) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:5000/api/codigos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        return;
      }

      cargarCodigos();
    } catch (err) {
    }
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h2>Gestión de Códigos de Descuento</h2>
        <button 
          onClick={() => { 
            setShowForm(!showForm); 
            setEditingCodigo(null); 
            setFormData({ codigo: '', descuento: '' }); 
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
          <h3>{editingCodigo ? 'Editar Código' : 'Nuevo Código'}</h3>
          <div style={{display: 'grid', gap: '1rem'}}>
            <input
              type="text"
              placeholder="Código (ej: VERANO2025)"
              value={formData.codigo}
              onChange={(e) => setFormData({...formData, codigo: e.target.value.toUpperCase()})}
              style={{padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd'}}
            />
            <input
              type="number"
              placeholder="Descuento (%)"
              min="0"
              max="100"
              step="0.01"
              value={formData.descuento}
              onChange={(e) => setFormData({...formData, descuento: e.target.value})}
              style={{padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd'}}
            />
            <div style={{display: 'flex', gap: '0.5rem'}}>
              <button type="submit" style={{flex: 1, padding: '0.75rem', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600'}}>
                {editingCodigo ? 'Actualizar' : 'Crear'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{flex: 1, padding: '0.75rem', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600'}}>
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      <div style={{overflow: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden'}}>
          <thead style={{background: '#f8f8f8'}}>
            <tr>
              <th style={{padding: '1rem', textAlign: 'left'}}>ID</th>
              <th style={{padding: '1rem', textAlign: 'left'}}>Código</th>
              <th style={{padding: '1rem', textAlign: 'left'}}>Descuento (%)</th>
              <th style={{padding: '1rem', textAlign: 'center'}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {codigos.map(cod => (
              <tr key={cod.idCodigo} style={{borderBottom: '1px solid #eee'}}>
                <td style={{padding: '0.75rem'}}>{cod.idCodigo}</td>
                <td style={{padding: '0.75rem', fontWeight: '600'}}>{cod.codigo}</td>
                <td style={{padding: '0.75rem'}}>{cod.descuento}%</td>
                <td style={{padding: '0.75rem', textAlign: 'center'}}>
                  <button onClick={() => handleEdit(cod)} className="btn-edit" aria-label="Editar código">
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button onClick={() => handleDelete(cod.idCodigo)} className="btn-delete" aria-label="Eliminar código">
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

// Componente para gestión de pedidos (placeholder)
function PedidosAdmin() {
  const [pedidos, setPedidos] = useState([]);
  const [detallesVisible, setDetallesVisible] = useState({});
  const [detallesPedido, setDetallesPedido] = useState({});

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:5000/api/pedidos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setPedidos(data);
    } catch (error) {
    }
  };

  const toggleDetalles = async (idPedido) => {
    if (detallesVisible[idPedido]) {
      setDetallesVisible({ ...detallesVisible, [idPedido]: false });
    } else {
      // Cargar detalles si no están cargados
      if (!detallesPedido[idPedido]) {
        try {
          const token = localStorage.getItem('auth_token');
          const res = await fetch(`http://localhost:5000/api/pedidos/${idPedido}/detalle`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await res.json();
          setDetallesPedido({ ...detallesPedido, [idPedido]: data });
        } catch (error) {
        }
      }
      setDetallesVisible({ ...detallesVisible, [idPedido]: true });
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="admin-section-header">
        <h2>Gestión de Pedidos</h2>
      </div>

      {pedidos.length === 0 ? (
        <div className="empty-state">
          No hay pedidos registrados
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Email</th>
              <th>Mesa</th>
              <th>Personas</th>
              <th>Fecha</th>
              <th className="center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(pedido => (
              <React.Fragment key={pedido.idPedido}>
                <tr>
                  <td>#{pedido.idPedido}</td>
                  <td>{pedido.nombreUsuario || 'Usuario'}</td>
                  <td>{pedido.email}</td>
                  <td>{pedido.mesa}</td>
                  <td>{pedido.cantidadClientes}</td>
                  <td>{formatearFecha(pedido.fechaPedido)}</td>
                  <td className="center">
                    <button
                      onClick={() => toggleDetalles(pedido.idPedido)}
                      className="btn-edit"
                      title="Ver detalles"
                    >
                      <i className={`fa-solid ${detallesVisible[pedido.idPedido] ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </td>
                </tr>
                {detallesVisible[pedido.idPedido] && detallesPedido[pedido.idPedido] && (
                  <tr>
                    <td colSpan="7" style={{background: '#f8f8f8', padding: '1rem'}}>
                      <strong>Detalles del Pedido:</strong>
                      <table style={{width: '100%', marginTop: '0.5rem'}}>
                        <thead>
                          <tr style={{background: '#e8e8e8'}}>
                            <th style={{padding: '0.5rem', textAlign: 'left'}}>Producto</th>
                            <th style={{padding: '0.5rem', textAlign: 'center'}}>Cantidad</th>
                            <th style={{padding: '0.5rem', textAlign: 'right'}}>Precio Unit.</th>
                            <th style={{padding: '0.5rem', textAlign: 'right'}}>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detallesPedido[pedido.idPedido].map(detalle => (
                            <tr key={detalle.idDetalle}>
                              <td style={{padding: '0.5rem'}}>{detalle.nombreProducto}</td>
                              <td style={{padding: '0.5rem', textAlign: 'center'}}>{detalle.cantidad}</td>
                              <td style={{padding: '0.5rem', textAlign: 'right'}}>${detalle.precio.toFixed(2)}</td>
                              <td style={{padding: '0.5rem', textAlign: 'right'}}>
                                ${(detalle.cantidad * detalle.precio).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                          <tr style={{fontWeight: 'bold', borderTop: '2px solid #333'}}>
                            <td colSpan="3" style={{padding: '0.5rem', textAlign: 'right'}}>TOTAL:</td>
                            <td style={{padding: '0.5rem', textAlign: 'right'}}>
                              ${detallesPedido[pedido.idPedido]
                                .reduce((sum, d) => sum + (d.cantidad * d.precio), 0)
                                .toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
