import React, { useState, useEffect } from 'react'; // <--- Agregamos useEffect
import { Link } from 'react-router-dom'; 
// import { productos, categorias } from '../data'; // <--- ESTO SE BORRA
import { obtenerProductos } from '../services/api';

import '../styles/home.css';         
import '../styles/stylescarrito.css'; 

const Catalogo = () => {
  // 1. Estado para lo que se muestra en pantalla
  const [listaProductos, setListaProductos] = useState([]); 
  
  // 2. Estado "Backup" con TODOS los datos originales (para poder filtrar)
  const [productosOriginales, setProductosOriginales] = useState([]);
  
  // 3. Estado para categorías dinámicas
  const [categorias, setCategorias] = useState([]);

  const [filtroActivo, setFiltroActivo] = useState("Todas");

  // --- EFECTO: Carga los datos al iniciar ---
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const data = await obtenerProductos(); // Llama a Spring Boot
    setListaProductos(data);
    setProductosOriginales(data); // Guardamos copia de seguridad
    
    // Extraer categorías únicas de los productos que llegaron
    const catsUnicas = [...new Set(data.map(prod => prod.categoria))];
    setCategorias(catsUnicas);
  };
  // ------------------------------------------

  const filtrar = (cat) => {
    setFiltroActivo(cat);
    if (cat === "Todas") {
      // Restauramos desde el backup
      setListaProductos(productosOriginales);
    } else {
      // Filtramos sobre el backup
      setListaProductos(productosOriginales.filter(p => p.categoria === cat));
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
          {/* Opción "Todas" */}
          <li 
            onClick={() => filtrar("Todas")}
            className={filtroActivo === "Todas" ? "active" : ""}
          >
            Todas
          </li>
          
          {/* Categorías dinámicas desde la BD */}
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
       
              {/* OJO AQUÍ: Si en tu BD pusiste URLs (https://...), úsalo directo.
                  Si pusiste nombres de archivo (torta.jpg), deja el '/' antes. 
                  Este código asume que pusiste URLs como en el script SQL */}
              <img 
                src={item.imagen} 
                alt={item.nombre} 
                onError={(e) => {e.target.src = "https://via.placeholder.com/300"}} // Fallback por si la imagen falla
              />
              
              <h3>{item.nombre}</h3>
              <div className="price">${item.precio.toLocaleString("es-CL")} CLP</div>
              
              <div className="buttons">
                <button 
                    className="btn-add" 
                    onClick={() => agregarAlCarrito(item)}
                >
                    Añadir
                </button>
                {/* Asegúrate que item.id exista en la BD */}
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