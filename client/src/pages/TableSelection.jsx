import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../assets/css/StyleGeneral.css';

export default function TableSelection() {
  const [diners, setDiners] = useState(1);
  const { updateDiners } = useCart();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    updateDiners(diners);
    navigate('/cart'); // O la ruta que prefieras después de seleccionar mesa
  };

  return (
    <div className="table-selection">
      <h2>Selección de Mesa</h2>
      <form onSubmit={handleSubmit} className="table-form">
        <div className="form-group">
          <label htmlFor="diners">Número de Comensales:</label>
          <input
            type="number"
            id="diners"
            min="1"
            max="8"
            value={diners}
            onChange={(e) => setDiners(Number(e.target.value))}
            required
          />
          <small>Máximo 4 platos por comensal</small>
        </div>
        <button type="submit" className="btn-primary">
          Confirmar Mesa
        </button>
      </form>
    </div>
  );
}