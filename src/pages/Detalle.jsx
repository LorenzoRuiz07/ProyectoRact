import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerProductoPorId } from '../services/api'; // <--- Importamos la nueva función

const Detalle = ({ agregarAlCarrito }) => { // Asumo que recibes la función del carrito
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDetalle = async () => {
      const data = await obtenerProductoPorId(id);
      if (data) {
        setProducto(data);
      } else {
        alert("Producto no encontrado");
        navigate('/');
      }
      setLoading(false);
    };
    cargarDetalle();
  }, [id, navigate]);

  if (loading) return <div>Cargando pastel... 🍰</div>;
  if (!producto) return null;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img 
            src={producto.imagen} 
            alt={producto.nombre} 
            className="img-fluid rounded" 
            onError={(e) => e.target.src = "https://via.placeholder.com/400"}
          />
        </div>
        <div className="col-md-6">
          <h2>{producto.nombre}</h2>
          <h3 className="text-primary">${producto.precio.toLocaleString('es-CL')}</h3>
          <p className="mt-3">{producto.descripcion}</p>
          <span className="badge bg-warning text-dark mb-3">{producto.categoria}</span>
          <br/>
          <button 
            className="btn btn-success btn-lg mt-3"
            onClick={() => agregarAlCarrito(producto)}
          >
            Añadir al Carrito 🛒
          </button>
          <button className="btn btn-outline-secondary mt-3 ms-2" onClick={() => navigate('/')}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default Detalle;