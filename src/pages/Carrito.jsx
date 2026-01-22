import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import '../styles/stylescarrito.css';

const Carrito = () => {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [cuponInput, setCuponInput] = useState("");
  const [descuento, setDescuento] = useState(0); // 0.10 es 10%
  const [mensajeCupon, setMensajeCupon] = useState(null);

  // 1. Cargar carrito al iniciar
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);
  }, []);

  // 2. Función para actualizar LocalStorage y Estado al mismo tiempo
  const actualizarTodo = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    // Disparamos evento para que el Navbar actualice el número
    window.dispatchEvent(new Event("storage"));
  };

  // 3. Cambiar cantidad (+ o -)
  const cambiarCantidad = (id, mensaje, delta) => {
    const nuevoCarrito = carrito.map(item => {
      if (item.id === id && item.mensaje === mensaje) {
        const nuevaCantidad = item.cantidad + delta;
        return { ...item, cantidad: nuevaCantidad < 1 ? 1 : nuevaCantidad };
      }
      return item;
    });
    actualizarTodo(nuevoCarrito);
  };

  // 4. Eliminar producto
  const eliminarProducto = (id, mensaje) => {
    const confirmar = window.confirm("¿Seguro que quieres sacar esta delicia del carrito? 🥺");
    if (confirmar) {
      const nuevoCarrito = carrito.filter(item => !(item.id === id && item.mensaje === mensaje));
      actualizarTodo(nuevoCarrito);
    }
  };

  // 5. Lógica de Cupones
  const aplicarCupon = () => {
    const codigo = cuponInput.trim().toUpperCase();
    
    if (codigo === "FELICES50") {
      setDescuento(0.10);
      setMensajeCupon({ texto: "¡Cupón UMAI10 aplicado! 10% OFF 🎉", tipo: "exito" });
    } else if (codigo === "DULCE20") {
      setDescuento(0.20);
      setMensajeCupon({ texto: "¡Súper descuento DULCE20 aplicado! 20% OFF 🍰", tipo: "exito" });
    } else {
      setDescuento(0);
      setMensajeCupon({ texto: "Cupón no válido 😢", tipo: "error" });
    }
  };

  // 6. Cálculos de Totales
  const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const montoDescuento = subtotal * descuento;
  const totalFinal = subtotal - montoDescuento;

  // --- RENDERIZADO SI EL CARRITO ESTÁ VACÍO ---
  if (carrito.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "70vh" }}>
        <h2 style={{ fontFamily: "'Pacifico', cursive", color: "#4e342e", fontSize: "3rem" }}>
          Tu carrito está vacío 🛒
        </h2>
        <p className="text-muted mt-3 mb-4">¡Parece que aún no has elegido tu postre!</p>
        <button 
            className="btn-agregar-grande" 
            style={{ maxWidth: "300px" }}
            onClick={() => navigate('/catalogo')}
        >
          Ir a ver delicias
        </button>
      </div>
    );
  }

  // --- RENDERIZADO CON PRODUCTOS ---
  return (
    <div className="container carrito-main-container">
      <h1 className="titulo-carrito">Tu Carrito de Compras</h1>

      {/* TABLA DE ITEMS */}
      <div className="tabla-container">
        <table className="tabla-carrito">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item, index) => (
              <tr key={index}>
                <td className="d-flex align-items-center gap-3">
                    <img src={`/${item.imagen}`} alt={item.nombre} className="item-img-carrito" />
                    <div>
                        <div className="fw-bold text-cacao">{item.nombre}</div>
                        {/* Si tiene dedicatoria, la mostramos pequeña */}
                        {item.mensaje && (
                            <small className="text-muted d-block">
                                💌 "{item.mensaje}"
                            </small>
                        )}
                    </div>
                </td>
                <td className="fw-bold text-muted">${item.precio.toLocaleString("es-CL")}</td>
                <td>
                    <div className="cantidad-control">
                        <button className="btn-cantidad" onClick={() => cambiarCantidad(item.id, item.mensaje, -1)}>-</button>
                        <span>{item.cantidad}</span>
                        <button className="btn-cantidad" onClick={() => cambiarCantidad(item.id, item.mensaje, 1)}>+</button>
                    </div>
                </td>
                <td className="fw-bold" style={{ color: "#4e342e" }}>
                    ${(item.precio * item.cantidad).toLocaleString("es-CL")}
                </td>
                <td>
                    <button className="btn-eliminar" onClick={() => eliminarProducto(item.id, item.mensaje)}>
                        🗑️ Borrar
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RESUMEN Y CUPONES */}
      <div className="resumen-compra">
        
        {/* LADO IZQUIERDO: CUPÓN */}
        <div className="cupon-box">
            <h4 style={{ fontFamily: 'Poppins', fontWeight: 'bold', color: '#4e342e' }}>🎟️ ¿Tienes un cupón?</h4>
            <div className="d-flex gap-2 mt-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Código (ej: UMAI10)" 
                    value={cuponInput}
                    onChange={(e) => setCuponInput(e.target.value)}
                />
                <button className="btn btn-dark" onClick={aplicarCupon}>Aplicar</button>
            </div>
            {mensajeCupon && (
                <p className={`mt-2 fw-bold ${mensajeCupon.tipo === "exito" ? "text-success" : "text-danger"}`}>
                    {mensajeCupon.texto}
                </p>
            )}
        </div>

        {/* LADO DERECHO: TOTALES */}
        <div className="total-box">
            <h3 style={{ fontFamily: 'Pacifico', marginBottom: '20px' }}>Resumen del Pedido</h3>
            
            <div className="fila-resumen">
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString("es-CL")}</span>
            </div>

            {descuento > 0 && (
                <div className="fila-resumen text-success fw-bold">
                    <span>Descuento:</span>
                    <span>-${montoDescuento.toLocaleString("es-CL")}</span>
                </div>
            )}

            <div className="fila-resumen total-final">
                <span>Total a Pagar:</span>
                <span>${totalFinal.toLocaleString("es-CL")}</span>
            </div>

            <button className="btn-pagar" onClick={() => alert("¡Redirigiendo a pasarela de pago! 💳 (Simulación)")}>
                Pagar Ahora
            </button>
        </div>

      </div>
    </div>
  );
};

export default Carrito;