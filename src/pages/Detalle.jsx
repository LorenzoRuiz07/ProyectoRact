import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerProductoPorId } from '../services/api';

import '../styles/detalle.css';

const Detalle = ({ agregarAlCarrito }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const cargarDetalle = async () => {
      const data = await obtenerProductoPorId(id);
      if (data) {
        setProducto(data);
      } else {
        alert("Producto no encontrado");
        navigate('/catalogo');
      }
      setLoading(false);
    };
    cargarDetalle();
  }, [id, navigate]);

  const restar = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };

  const sumar = () => {
    setCantidad(cantidad + 1);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', color: '#4e342e' }}>Cargando dulzura... 🍰</div>;
  if (!producto) return null;

  return (
    <div className="detalle-container">

      <button className="btn-volver" onClick={() => navigate(-1)}>
        ← Volver al catálogo
      </button>

      <div className="detalle-card">

        <div className="img-container">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="detalle-img"
            onError={(e) => e.target.src = "https://via.placeholder.com/400"}
          />
        </div>

        <div className="info-container">

          <h1 className="titulo-detalle">{producto.nombre}</h1>
          <span className="categoria-badge">{producto.categoria}</span>

          <p className="descripcion-detalle">
            {producto.descripcion}
          </p>

          <div className="precio-detalle">
            ${producto.precio.toLocaleString('es-CL')}
          </div>

          <div className="actions-container">

            <div className="contador-umai">
              <button onClick={restar} className="btn-contador">−</button>
              <span className="numero-contador">{cantidad}</span>
              <button onClick={sumar} className="btn-contador">+</button>
            </div>

            <button
              className="btn-agregar-carrito"
              onClick={() => agregarAlCarrito(producto, cantidad)}
            >
              Agregar al Carrito
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Detalle;