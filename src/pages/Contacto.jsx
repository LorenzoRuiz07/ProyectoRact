import React, { useState } from 'react';
import '../styles/home.css';
import '../styles/contacto.css';

const Contacto = () => {
  const [datos, setDatos] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!datos.nombre || !datos.email || !datos.mensaje) {
      alert("Por favor completa todos los campos 🍰");
      return;
    }
    alert(`¡Gracias ${datos.nombre}! Hemos recibido tu mensaje. Te responderemos a ${datos.email} pronto.`);
    setDatos({ nombre: '', email: '', mensaje: '' });
  };

  return (
    <div className="position-relative" style={{ minHeight: '90vh', overflow: 'hidden' }}>
      <div className="banda-lateral banda-izquierda"></div>
      <div className="banda-lateral banda-derecha"></div>
      <div className="container fade-in-container" style={{ padding: '60px 20px' }}>
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-5 mb-5 mb-lg-0">
            <div className="info-seccion">
              <h2>Contáctanos</h2>
              <p className="lead text-muted">
                ¿Tienes alguna duda sobre nuestros ingredientes o quieres cotizar una torta especial para tu evento?
              </p>

              <div className="mt-4">
                <p><strong>📍 Dirección:</strong> Av. Siempre Viva 123, Santiago.</p>
                <p><strong>📞 Teléfono:</strong> +56 9 1234 5678</p>
                <p><strong>📧 Email:</strong> contacto@pasteleriaumai.cl</p>
              </div>
              <div className="destacado">
                <h5 className="fw-bold" style={{ color: '#4e342e' }}>🕒 Horario de Atención</h5>
                <p className="mb-0 text-muted">Lunes a Viernes: 09:00 - 19:00 hrs.</p>
                <p className="mb-0 text-muted">Sábados: 10:00 - 14:00 hrs.</p>
              </div>
              <div className="redes-contacto">
                <h4 style={{ fontFamily: 'Poppins', fontSize: '1.2rem', fontWeight: 'bold' }}>Síguenos:</h4>
                <a href="#" className="item-red">
                  <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>📸</span> Instagram
                </a>
                <a href="#" className="item-red">
                  <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>📘</span> Facebook
                </a>
                <a href="#" className="item-red">
                  <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>🎵</span> TikTok
                </a>
              </div>
            </div>
          </div>
          
          <div className="col-lg-5 offset-lg-1">
            <div className="card-contacto">
              <div className="text-center mb-4">
                <span style={{ fontSize: '3rem' }}>💌</span>
                <h2 style={{ fontFamily: 'Pacifico', color: '#4e342e' }}>Escríbenos</h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small">Nombre Completo</label>
                  <input 
                    type="text" 
                    name="nombre"
                    className="form-control" 
                    placeholder="Tu nombre aquí..."
                    value={datos.nombre}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small">Correo Electrónico</label>
                  <input 
                    type="email" 
                    name="email"
                    className="form-control" 
                    placeholder="nombre@ejemplo.com"
                    value={datos.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold text-muted small">Mensaje o Pedido Especial</label>
                  <textarea 
                    name="mensaje"
                    className="form-control" 
                    rows="4"
                    placeholder="Cuéntanos qué necesitas..."
                    value={datos.mensaje}
                    onChange={handleChange}
                    style={{ resize: 'none' }}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-pink w-100 shadow-sm">
                  🍰 Enviar Mensaje
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contacto;