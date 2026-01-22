import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { productos, categorias } from '../data';
import '../styles/home.css';         
import '../styles/stylescarrito.css'; 

const Catalogo = () => {
  const [listaProductos, setListaProductos] = useState(productos);
  const [filtroActivo, setFiltroActivo] = useState("Todas");
  const filtrar = (cat) => {
    setFiltroActivo(cat);
    if (cat === "Todas") {
      setListaProductos(productos);
    } else {
      setListaProductos(productos.filter(p => p.categoria === cat));
    }
  };
  const agregarAlCarrito = (producto) => {
    const item = { ...producto, cantidad: 1 };
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(item);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    window.dispatchEvent(new Event("storage"));
    alert("¡Agregado al carrito! 🛒");
  };

  return (
    <div className="catalog-container">
      <aside className="categories-sidebar">
        <h2>Categorías</h2>
        <ul>
          <li onClick={() => filtrar("Todas")}>Todas</li>
          {categorias.map((cat, index) => (
            <li key={index} onClick={() => filtrar(cat)}>
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
       
              <img src={`/${item.imagen}`} alt={item.nombre} />
              <h3>{item.nombre}</h3>
              <div className="price">${item.precio.toLocaleString("es-CL")} CLP</div>
              <div className="buttons">
                {/* Botón Azul: Añadir */}
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