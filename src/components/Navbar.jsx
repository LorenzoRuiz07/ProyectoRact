import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/home.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [cartCount, setCartCount] = useState(0);
  const [usuario, setUsuario] = useState(null);

  const actualizarDatos = () => {
    const carrito = JSON.parse(localStorage.getItem("carritoUmai")) || [];
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    setCartCount(total);

    const userStored = JSON.parse(localStorage.getItem("usuario"));
    setUsuario(userStored);
  };

  useEffect(() => {
    actualizarDatos();
    
    window.addEventListener('storage', actualizarDatos);
    return () => window.removeEventListener('storage', actualizarDatos);
  }, [location]);

  const handleLogout = () => {
      localStorage.removeItem("usuario");
      setUsuario(null);
      navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">Pastelería ¡Umai!</div>
      
      <ul className="nav-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/catalogo">Catalogo</Link></li>
        <li><Link to="/servicios">Servicios</Link></li>
        <li><Link to="/proyectos">Proyectos</Link></li>
        <li><Link to="/contacto">Contacto</Link></li>
        <li><Link to="/nosotros">Nosotros</Link></li>

        <li>
          <Link to="/carrito">
            🛒 <span id="cart-count">{cartCount}</span>
          </Link>
        </li>
      </ul>

      {usuario ? (
        <div className="user-panel">
            <span className="user-name">Bienvenido, {usuario.nombre} </span>
            
            {usuario.rol === 'admin' && (
                <button className="btn-admin" onClick={() => navigate('/admin')}>Panel</button>
            )}

            <button className="btn-logout" onClick={handleLogout}>Salir</button>
        </div>
      ) : (
        <div className="btnLogin">
            <Link to="/login">
                <button>Iniciar Sesion</button>
            </Link>
        </div>
      )}

    </nav>
  );
};

export default Navbar;