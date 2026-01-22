import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css'; // Importamos tus estilos

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);

  // Esta función lee el carrito del LocalStorage para actualizar el número
  const actualizarContador = () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    setCartCount(total);
  };

  // Actualizamos al cargar la página
  useEffect(() => {
    actualizarContador();
    
    // Un pequeño truco para escuchar cambios en el storage (opcional por ahora)
    window.addEventListener('storage', actualizarContador);
    return () => window.removeEventListener('storage', actualizarContador);
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">Pasteleria ¡Umai!</div>
      <ul className="nav-links">
        {/* En React usamos <Link> en vez de <a> para no recargar la página */}
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/catalogo">Catalogo</Link></li>
        <li><Link to="/servicios">Servicios</Link></li>
        <li><Link to="/proyectos">Proyectos</Link></li>
        <li><Link to="/contacto">Contacto</Link></li>
        <li><Link to="/nosotros">Nosotros</Link></li>
        {/* Enlace al Carrito con contador dinámico */}
        <li>
          <Link to="/carrito">
            🛒 <span id="cart-count">{cartCount}</span>
          </Link>
        </li>
      </ul>
      <div className="btnLogin">
        <Link to="/login">
            <button>Iniciar Sesion</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;