import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productos } from '../data';
import '../styles/home.css';
import '../styles/stylescarrito.css';

const Detalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");

  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "50vh" }}>
        <h2 className="text-muted">Producto no encontrado 😕</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/catalogo')}>
          Volver al catálogo
        </button>
      </div>
    );
  }

  const handleAgregarCarrito = () => {
    const itemParaCarrito = {
      ...producto,
      mensaje: mensaje,
      nombre: mensaje ? `${producto.nombre} (Dedicatoria: ${mensaje})` : producto.nombre,
      cantidad: 1
    };

    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    const existe = carritoActual.find(item => item.id === itemParaCarrito.id && item.mensaje === itemParaCarrito.mensaje);

    if (existe) {
      existe.cantidad += 1;
    } else {
      carritoActual.push(itemParaCarrito);
    }

    localStorage.setItem("carrito", JSON.stringify(carritoActual));
    window.dispatchEvent(new Event("storage"));
    
    alert("¡Agregado al carrito! 🛒");
    navigate('/catalogo');
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "85vh", padding: "20px" }}>
      
      <div 
        className="card shadow-lg border-0" 
        style={{ 
          maxWidth: '750px',   
          width: '100%', 
          borderRadius: '20px',
          padding: '30px',   
          backgroundColor: '#fff'
        }}
      >
        <button 
          className="btn-volver mb-2" 
          onClick={() => navigate('/catalogo')}
          style={{ fontSize: '0.9rem' }}
        >
          ← Volver
        </button>

        <div className="row align-items-center">
          <div className="col-md-5 text-center mb-3 mb-md-0">
            <img 
              src={`/${producto.imagen}`} 
              alt={producto.nombre} 
              className="shadow-sm" 
              style={{ 
                width: '100%', 
                height: '280px',  
                objectFit: 'cover', 
                borderRadius: '15px' 
              }} 
            />
          </div>

          <div className="col-md-7 ps-md-4">
            
            <span className="text-muted text-uppercase fw-bold" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>
              {producto.categoria}
            </span>
            
            <h2 className="my-1" style={{ fontFamily: "'Pacifico', cursive", color: '#4e342e', fontSize: '1.8rem' }}>
              {producto.nombre}
            </h2>
            
            <p className="text-muted mt-2" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
              {producto.descripcion}
            </p>

            <div className="fw-bold mb-3" style={{ fontSize: '1.6rem', color: '#4e342e' }}>
              ${producto.precio.toLocaleString("es-CL")}
            </div>

            <div className="mensaje-box mb-3 p-2" style={{ background: '#f9f9f9', borderRadius: '10px' }}>
              <textarea 
                className="form-control border-0 bg-transparent"
                rows="2"
                placeholder="Escribe una dedicatoria aquí..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                style={{ resize: "none", fontSize: "0.85rem", boxShadow: "none" }}
              />
            </div>

            <button 
              className="btn-agregar-grande w-100 shadow-sm"
              onClick={handleAgregarCarrito}
              style={{ padding: '10px 0', fontSize: '1rem' }}
            >
              Añadir al Carrito 🛒
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Detalle;