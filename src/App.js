import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Importación de Componentes
import Navbar from './components/Navbar';
import Notification from './components/Notification'; // <--- IMPORTAMOS LA NOTIFICACIÓN
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Detalle from './pages/Detalle';
import Servicios from './pages/Servicios';
import Proyectos from './pages/Proyectos';
import Contacto from './pages/Contacto';
import Nosotros from './pages/Nosotros';
import Carrito from './pages/Carrito'; 
import Login from './pages/Login';
import Registro from './pages/Registro';
import Admin from './pages/Admin';

function App() {
  // 1. ESTADO DEL CARRITO
  const [carrito, setCarrito] = useState(() => {
    const datosGuardados = localStorage.getItem("carritoUmai");
    return datosGuardados ? JSON.parse(datosGuardados) : [];
  });

  // 2. ESTADO DE LA NOTIFICACIÓN VISUAL
  const [notificacion, setNotificacion] = useState({
    visible: false,
    mensaje: "",
    tipo: "" // 'success' o 'error'
  });

  // Guardar en LocalStorage
  useEffect(() => {
    localStorage.setItem("carritoUmai", JSON.stringify(carrito));
    window.dispatchEvent(new Event("storage"));
  }, [carrito]);

  // --- FUNCIÓN HELPER PARA MOSTRAR LA NOTIFICACIÓN ---
  const lanzarNotificacion = (mensaje, tipo) => {
    setNotificacion({ visible: true, mensaje, tipo });
    
    // Se oculta sola después de 3 segundos
    setTimeout(() => {
      setNotificacion(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  // 3. FUNCIÓN AGREGAR (MODIFICADA SIN ALERTS FEOS)
  const agregarAlCarrito = (producto, cantidadSeleccionada = 1) => {
    if (!producto || !producto.id) return;

    const carritoActual = JSON.parse(localStorage.getItem("carritoUmai")) || [];
    const itemExistente = carritoActual.find(item => item.id === producto.id);
    
    // Cálculo de stock
    const cantidadEnCarrito = itemExistente ? itemExistente.cantidad : 0;
    const totalDeseado = cantidadEnCarrito + cantidadSeleccionada;
    const stockDisponible = producto.stock; 

    // VALIDACIÓN DE STOCK
    if (stockDisponible !== undefined && totalDeseado > stockDisponible) {
        // En vez de alert(), usamos nuestra notificación bonita
        lanzarNotificacion(
            `¡UPS! Falta Stock 📦\nQuedan: ${stockDisponible}\nYa llevas: ${cantidadEnCarrito}\nQuerías: ${cantidadSeleccionada}`, 
            "error"
        );
        return; 
    }

    if (itemExistente) {
      // SUMAR
      const nuevoCarrito = carritoActual.map(item => 
        item.id === producto.id 
          ? { ...item, cantidad: item.cantidad + cantidadSeleccionada } 
          : item
      );
      setCarrito(nuevoCarrito);
      lanzarNotificacion(`¡Añadimos ${cantidadSeleccionada} más! 🍰\n(Total: ${itemExistente.cantidad + cantidadSeleccionada})`, "success");
      
    } else {
      // NUEVO
      const nuevoProducto = { ...producto, cantidad: cantidadSeleccionada };
      setCarrito([...carritoActual, nuevoProducto]);
      lanzarNotificacion(`¡Agregado al carrito! 🛒\n(${producto.nombre})`, "success");
    }
  };

  return (
    <BrowserRouter>
      {/* AQUÍ ESTÁ EL COMPONENTE DE NOTIFICACIÓN GLOBAL */}
      <Notification 
        mensaje={notificacion.mensaje} 
        tipo={notificacion.tipo} 
        visible={notificacion.visible} 
      />

      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Home />} />

        <Route 
            path="/catalogo" 
            element={<Catalogo agregarAlCarrito={agregarAlCarrito} />} 
        />

        <Route 
          path="/producto/:id" 
          element={<Detalle agregarAlCarrito={agregarAlCarrito} />} 
        />
        
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/proyectos" element={<Proyectos />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/nosotros" element={<Nosotros />} />
        
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/carrito.html" element={<Carrito />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;