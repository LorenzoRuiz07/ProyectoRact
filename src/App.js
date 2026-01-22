import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';
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
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Home />} />

        <Route path="/catalogo" element={<Catalogo />} />

        <Route path="/producto/:id" element={<Detalle />} />
        
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