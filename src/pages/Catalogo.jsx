import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { productos, categorias } from '../data'; // Importamos datos Y categorías
import '../styles/home.css';          // Estilos generales
import '../styles/stylescarrito.css'; // Estilos específicos (Sidebar, Grid, Tarjetas)

const Catalogo = () => {
  const [listaProductos, setListaProductos] = useState(productos);
  // Estado para saber qué categoría está seleccionada (opcional, para efectos visuales)
  const [filtroActivo, setFiltroActivo] = useState("Todas");

  // Función para filtrar productos
  const filtrar = (cat) => {
    setFiltroActivo(cat);
    if (cat === "Todas") {
      setListaProductos(productos);
    } else {
      setListaProductos(productos.filter(p => p.categoria === cat));
    }
  };

  // Función de Añadir al Carrito
  const agregarAlCarrito = (producto) => {
    const item = { ...producto, cantidad: 1 };
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(item);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    
    // Dispara el evento para actualizar el numerito del navbar
    window.dispatchEvent(new Event("storage"));
    alert("¡Agregado al carrito! 🛒");
  };

  return (
    /* Usamos la clase 'catalog-container' de stylescarrito.css para dividir la pantalla */
    <div className="catalog-container">
      
      {/* 1. BARRA LATERAL (SIDEBAR) */}
      <aside className="categories-sidebar">
        <h2>Categorías</h2>
        <ul>
          <li onClick={() => filtrar("Todas")}>Todas</li>
          {/* Mapeamos las categorías desde data.js */}
          {categorias.map((cat, index) => (
            <li key={index} onClick={() => filtrar(cat)}>
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      {/* 2. ÁREA PRINCIPAL DE PRODUCTOS */}
      <main className="products-area">
        <h1 className="TituloIMG" style={{ color: "#4e342e", textAlign: "center", fontFamily: "Pacifico" }}>
            Nuestros Productos
        </h1>

        {/* Grilla de productos usando tus clases CSS exactas */}
        <div className="product-grid">
          {listaProductos.map((item) => (
            <div key={item.id} className="product-card">
              {/* Imagen */}
              <img src={`/${item.imagen}`} alt={item.nombre} />
              
              {/* Título */}
              <h3>{item.nombre}</h3>
              
              {/* Precio */}
              <div className="price">${item.precio.toLocaleString("es-CL")} CLP</div>
              
              {/* 3. LOS DOS BOTONES (Añadir y Ver Detalle) */}
              <div className="buttons">
                {/* Botón Azul: Añadir */}
                <button 
                    className="btn-add" 
                    onClick={() => agregarAlCarrito(item)}
                >
                    Añadir
                </button>

                {/* Botón Gris: Ver Detalle (Con el Link arreglado) */}
                <Link to={`/producto/${item.id}`}>
                    <button className="btn-detail">Ver detalle</button>
                </Link>
              </div>

            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Catalogo;