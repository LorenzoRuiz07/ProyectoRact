import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import '../styles/stylescarrito.css';

const Carrito = () => {
    const navigate = useNavigate();
    const [carrito, setCarrito] = useState([]);

    // Estados para Cupones
    const [cuponInput, setCuponInput] = useState("");
    const [descuento, setDescuento] = useState(0);
    const [mensajeCupon, setMensajeCupon] = useState(null);

    // Estados para Errores y Modales
    const [errorStock, setErrorStock] = useState(null);
    const [compraExitosa, setCompraExitosa] = useState(null);

    useEffect(() => {
        const carritoGuardado = JSON.parse(localStorage.getItem("carritoUmai")) || [];
        setCarrito(carritoGuardado);
    }, []);

    // --- CÁLCULOS MATEMÁTICOS ---
    const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const montoDescuento = subtotal * descuento;
    const totalFinal = subtotal - montoDescuento;

    const actualizarTodo = (nuevoCarrito) => {
        setCarrito(nuevoCarrito);
        localStorage.setItem("carritoUmai", JSON.stringify(nuevoCarrito));
        window.dispatchEvent(new Event("storage"));
    };

    const cambiarCantidad = (id, mensaje, delta) => {
        setErrorStock(null);
        const nuevoCarrito = carrito.map(item => {
            if (item.id === id && item.mensaje === mensaje) {
                const nuevaCantidad = item.cantidad + delta;
                return { ...item, cantidad: nuevaCantidad < 1 ? 1 : nuevaCantidad };
            }
            return item;
        });
        actualizarTodo(nuevoCarrito);
    };

    const eliminarProducto = (id, mensaje) => {
        if (window.confirm("¿Sacar este producto del carrito?")) {
            setErrorStock(null);
            const nuevoCarrito = carrito.filter(item => !(item.id === id && item.mensaje === mensaje));
            actualizarTodo(nuevoCarrito);
        }
    };

    const aplicarCupon = () => {
        const codigo = cuponInput.trim().toUpperCase();
        if (codigo === "FELICES50") {
            setDescuento(0.10);
            setMensajeCupon({ texto: "¡Cupón aplicado! 10% OFF 🎉", tipo: "exito" });
        } else if (codigo === "DULCE20") {
            setDescuento(0.20);
            setMensajeCupon({ texto: "¡Descuento DULCE20 aplicado! 20% OFF 🍰", tipo: "exito" });
        } else {
            setDescuento(0);
            setMensajeCupon({ texto: "Cupón no válido :(", tipo: "error" });
        }
    };

    // --- LÓGICA DE COMPRA OPTIMIZADA (Sustituye la lógica anterior) ---
    const finalizarCompra = async () => {
        setErrorStock(null);

        const usuarioStorage = localStorage.getItem("usuario");
        if (!usuarioStorage) {
            alert("🔒 Inicia sesión para continuar.");
            navigate('/login');
            return;
        }
        const usuario = JSON.parse(usuarioStorage);

        try {
            // PREPARAR DATOS: Enviamos los IDs y cantidades para que el Backend descuente el stock
            const compraPayload = {
                nombreCliente: usuario.nombre,
                emailCliente: usuario.email,
                total: totalFinal,
                descuento: montoDescuento,
                fecha: new Date().toLocaleString("es-CL"),
                detalleCompra: carrito.map(item => `${item.nombre} x${item.cantidad}`).join(", "),
                // Esta lista permite al backend actualizar la tabla 'productos'
                items: carrito.map(item => ({
                    id: item.id,
                    cantidad: item.cantidad
                }))
            };

            const response = await fetch("http://localhost:8080/api/compras", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(compraPayload)
            });

            if (response.ok) {
                // ÉXITO: El stock ya bajó en la DB y la compra se registró
                setCompraExitosa({
                    usuario: usuario.nombre,
                    email: usuario.email,
                    total: totalFinal,
                    items: carrito,
                    descuentoAplicado: montoDescuento
                });

                actualizarTodo([]);
            } else {
                // Capturamos errores de stock insuficiente del backend
                const errorMsg = await response.text();
                setErrorStock(errorMsg || "Hubo un problema al procesar el pedido.");
            }

        } catch (error) {
            console.error("Error:", error);
            setErrorStock("Error de conexión con el servidor. ¿Está el backend encendido?");
        }
    };

    const cerrarModalYSalir = () => {
        setCompraExitosa(null);
        navigate('/');
    };

    if (carrito.length === 0 && !compraExitosa) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "70vh" }}>
                <h2 style={{ fontFamily: "'Pacifico', cursive", color: "#4e342e", fontSize: "3rem" }}>Tu carrito está vacío 🛒</h2>
                <button className="btn-agregar-grande" onClick={() => navigate('/catalogo')}>Ir a ver delicias</button>
            </div>
        );
    }

    return (
        <div className="container carrito-main-container">

            <style>{`
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(78, 52, 46, 0.85);
            display: flex; align-items: center; justify-content: center;
            z-index: 2000; animation: fadeIn 0.3s;
        }
        .modal-umai {
            background: white; width: 90%; max-width: 480px; padding: 30px;
            border-radius: 15px; text-align: center;
            box-shadow: 0 15px 35px rgba(0,0,0,0.4); border: 4px solid #dba359;
            animation: slideUp 0.4s;
        }
        .modal-icon { font-size: 50px; margin-bottom: 10px; }
        .modal-title { font-family: 'Pacifico', cursive; color: #4e342e; font-size: 2rem; margin-bottom: 5px; }
        .modal-subtitle { color: #888; margin-bottom: 20px; font-size: 0.9rem; }
        .resumen-boleta { 
            background: #fff8e1; padding: 20px; border-radius: 8px; 
            text-align: left; margin-bottom: 20px; border: 1px dashed #dba359;
        }
        .resumen-item { display: flex; justify-content: space-between; font-size: 0.9rem; color: #555; margin-bottom: 5px;}
        .resumen-divider { border-top: 1px dashed #ccc; margin: 10px 0; }
        .fila-fiscal { display: flex; justify-content: space-between; font-size: 0.95rem; color: #666; }
        .fila-descuento { display: flex; justify-content: space-between; font-size: 0.95rem; color: #2ecc71; font-weight: bold; }
        .fila-total { 
            display: flex; justify-content: space-between; 
            font-size: 1.3rem; font-weight: bold; color: #4e342e; 
            margin-top: 10px; padding-top: 10px; border-top: 2px solid #4e342e; 
        }
        .btn-umai-ok {
            background: #4e342e; color: white; border: none;
            padding: 12px 30px; border-radius: 50px;
            font-size: 1.1rem; cursor: pointer; transition: 0.3s; width: 100%;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

            <h1 className="titulo-carrito">Tu Carrito de Compras</h1>

            {carrito.length > 0 && (
                <>
                    <div className="tabla-container">
                        <table className="tabla-carrito">
                            <thead>
                                <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th>Acción</th></tr>
                            </thead>
                            <tbody>
                                {carrito.map((item, index) => (
                                    <tr key={index}>
                                        <td className="d-flex align-items-center gap-3">
                                            <img src={item.imagen} alt={item.nombre} className="item-img-carrito" onError={(e) => { e.target.src = "https://via.placeholder.com/60"; }} />
                                            <div>
                                                <div className="fw-bold text-cacao">{item.nombre}</div>
                                                {item.mensaje && <small className="text-muted d-block">💌 "{item.mensaje}"</small>}
                                            </div>
                                        </td>
                                        <td>${item.precio.toLocaleString("es-CL")}</td>
                                        <td>
                                            <div className="cantidad-control">
                                                <button className="btn-cantidad" onClick={() => cambiarCantidad(item.id, item.mensaje, -1)}>-</button>
                                                <span>{item.cantidad}</span>
                                                <button className="btn-cantidad" onClick={() => cambiarCantidad(item.id, item.mensaje, 1)}>+</button>
                                            </div>
                                        </td>
                                        <td className="fw-bold" style={{ color: "#4e342e" }}>${(item.precio * item.cantidad).toLocaleString("es-CL")}</td>
                                        <td><button className="btn-eliminar" onClick={() => eliminarProducto(item.id, item.mensaje)}>🗑️</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="resumen-compra">
                        <div className="cupon-box">
                            <h4>🎟️ Cupón</h4>
                            <div className="d-flex gap-2 mt-3">
                                <input type="text" className="form-control" placeholder="Código" value={cuponInput} onChange={(e) => setCuponInput(e.target.value)} />
                                <button className="btn btn-dark" onClick={aplicarCupon}>Aplicar</button>
                            </div>
                            {mensajeCupon && <p className={`mt-2 fw-bold ${mensajeCupon.tipo === "exito" ? "text-success" : "text-danger"}`}>{mensajeCupon.texto}</p>}
                        </div>

                        <div className="total-box">
                            <h3>Resumen</h3>
                            <div className="fila-resumen"><span>Subtotal:</span><span>${subtotal.toLocaleString("es-CL")}</span></div>
                            {descuento > 0 && (
                                <div className="fila-resumen text-success fw-bold"><span>Descuento:</span><span>-${montoDescuento.toLocaleString("es-CL")}</span></div>
                            )}
                            <div className="fila-resumen total-final mt-2"><span>Total a Pagar:</span><span>${totalFinal.toLocaleString("es-CL")}</span></div>
                            {errorStock && <div className="alert alert-danger mt-3" style={{ fontSize: '0.9rem', borderLeft: '4px solid #dc3545' }}>{errorStock}</div>}
                            <button className="btn-pagar mt-3" onClick={finalizarCompra}>Pagar Ahora</button>
                        </div>
                    </div>
                </>
            )}

            {compraExitosa && (
                <div className="modal-overlay">
                    <div className="modal-umai">
                        <div className="modal-icon">🧾✨</div>
                        <h2 className="modal-title">¡Compra Exitosa!</h2>
                        <p className="modal-subtitle">Comprobante para <strong>{compraExitosa.usuario}</strong></p>
                        <div className="resumen-boleta">
                            {compraExitosa.items.map((it, idx) => (
                                <div key={idx} className="resumen-item"><span>{it.cantidad} x {it.nombre}</span><span>${(it.precio * it.cantidad).toLocaleString('es-CL')}</span></div>
                            ))}
                            <div className="resumen-divider"></div>
                            {(() => {
                                const totalPago = compraExitosa.total;
                                const desc = compraExitosa.descuentoAplicado;
                                const neto = Math.round(totalPago / 1.19);
                                const iva = totalPago - neto;
                                return (
                                    <>
                                        <div className="fila-fiscal"><span>Subtotal:</span><span>${(totalPago + desc).toLocaleString('es-CL')}</span></div>
                                        {desc > 0 && <div className="fila-descuento"><span>Descuento:</span><span>-${desc.toLocaleString('es-CL')}</span></div>}
                                        <div className="resumen-divider"></div>
                                        <div className="fila-fiscal"><span>Monto Neto:</span><span>${neto.toLocaleString('es-CL')}</span></div>
                                        <div className="fila-fiscal"><span>IVA (19%):</span><span>${iva.toLocaleString('es-CL')}</span></div>
                                        <div className="fila-total"><span>TOTAL PAGADO:</span><span>${totalPago.toLocaleString('es-CL')}</span></div>
                                    </>
                                );
                            })()}
                        </div>
                        <button className="btn-umai-ok" onClick={cerrarModalYSalir}>Aceptar y Salir</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Carrito;