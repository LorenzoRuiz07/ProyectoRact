import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom'; 
import { obtenerProductos } from '../services/api';

import '../styles/home.css';         
import '../styles/stylescarrito.css'; 

// 1. RECIBIMOS LA FUNCIÓN "MAESTRA" DESDE APP.JS
const Catalogo = ({ agregarAlCarrito }) => {
  
  const [listaProductos, setListaProductos] = useState([]); 
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState("Todas");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const data = await obtenerProductos(); 
    setListaProductos(data);
    setProductosOriginales(data); 
    
    const catsUnicas = [...new Set(data.map(prod => prod.categoria))];
    setCategorias(catsUnicas);
  };

  const filtrar = (cat) => {
    setFiltroActivo(cat);
    if (cat === "Todas") {
      setListaProductos(productosOriginales);
    } else {
      setListaProductos(productosOriginales.filter(p => p.categoria === cat));
    }
  };

  // ❌ AQUÍ HABÍA UNA FUNCIÓN "IMPOSTORA" QUE BORRAMOS.
  // Ahora el botón usará directamente la que recibimos arriba ({ agregarAlCarrito }).

  return (
    <div className="catalog-container">
      <aside className="categories-sidebar">
        <h2>Categorías</h2>
        <ul>
          <li 
            onClick={() => filtrar("Todas")}
            className={filtroActivo === "Todas" ? "active" : ""}
          >
            Todas
          </li>
          
          {categorias.map((cat, index) => (
            <li 
                key={index} 
                onClick={() => filtrar(cat)}
                className={filtroActivo === cat ? "active" : ""}
            >
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      <main className="products-area">
        <h1 className="TituloIMG" style={{ color: "#4e342e", textAlign: "center", fontFamily: "Pacifico" }}>
            Nuestros Productos
        </h1>

        <div className="product-grid">
          {listaProductos.map((item) => (
            <div key={item.id} className="product-card">
       
              <img 
                src={item.imagen} 
                alt={item.nombre} 
                onError={(e) => {e.target.src = "https://via.placeholder.com/300"}} 
              />
              
              <h3>{item.nombre}</h3>
              <div className="price">${item.precio.toLocaleString("es-CL")} CLP</div>
              
              <div className="buttons">
                {/* ESTE BOTÓN AHORA LLAMA A LA FUNCIÓN DE APP.JS */}
                <button 
                    className="btn-add" 
                    onClick={() => agregarAlCarrito(item)}
                >
                    Añadir
                </button>
                
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