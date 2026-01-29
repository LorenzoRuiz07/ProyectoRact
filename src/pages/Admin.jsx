import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/admin.css';

const Admin = () => {
  const navigate = useNavigate();
  
  // 🔒 ESTADOS
  const [accesoAutorizado, setAccesoAutorizado] = useState(false);
  const [cargando, setCargando] = useState(true);
  
  // DATOS
  const [vista, setVista] = useState('productos');
  const [listaProductos, setListaProductos] = useState([]);
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [listaVentas, setListaVentas] = useState([]);

  // EDICIÓN
  const [idEditar, setIdEditar] = useState(null);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  // FORMULARIOS
  const [formProd, setFormProd] = useState({ nombre: '', precio: '', categoria: 'Pasteles', descripcion: '', stock: 20 });
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [formUser, setFormUser] = useState({ nombre: '', email: '', password: '', rol: 'cliente' });

  // Token helper
  const getToken = useCallback(() => localStorage.getItem("token"), []);

  // --- 1. FUNCIONES DE CARGA ---
  const cargarProductos = useCallback(async () => {
    try {
        const res = await fetch("http://localhost:8080/api/productos");
        if(res.ok) setListaProductos(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  const cargarUsuarios = useCallback(async () => {
    try {
        const res = await fetch("http://localhost:8080/api/usuarios", { 
            headers: { "Authorization": `Bearer ${getToken()}` } 
        });
        if(res.ok) setListaUsuarios(await res.json());
    } catch (e) { console.error(e); }
  }, [getToken]);

  const cargarVentas = useCallback(async () => {
    try {
        const res = await fetch("http://localhost:8080/api/compras", { 
            headers: { "Authorization": `Bearer ${getToken()}` } 
        });
        if(res.ok) setListaVentas(await res.json());
    } catch (e) { console.error(e); }
  }, [getToken]);

  // --- 2. SEGURIDAD ---
  useEffect(() => {
    const verificarPermisos = () => {
        const usuarioStorage = localStorage.getItem("usuario");
        const token = getToken();

        if (!usuarioStorage || !token) {
            navigate('/login');
            return;
        }
        const usuario = JSON.parse(usuarioStorage);
        if (usuario.rol !== 'admin') {
            navigate('/');
        } else {
            setAccesoAutorizado(true);
        }
        setCargando(false);
    };
    verificarPermisos();
  }, [navigate, getToken]);

  useEffect(() => {
    if (accesoAutorizado) {
        cargarProductos();
        cargarUsuarios();
        cargarVentas();
    }
  }, [accesoAutorizado, cargarProductos, cargarUsuarios, cargarVentas]);

  // --- CRUD ---
  const manejarSubmitProducto = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", formProd.nombre);
    formData.append("precio", formProd.precio);
    formData.append("categoria", formProd.categoria);
    formData.append("descripcion", formProd.descripcion);
    formData.append("stock", formProd.stock);
    if (archivoImagen) formData.append("imagen", archivoImagen);

    const url = idEditar ? `http://localhost:8080/api/productos/${idEditar}` : "http://localhost:8080/api/productos";
    const method = idEditar ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method: method,
            headers: { "Authorization": `Bearer ${getToken()}` },
            body: formData
        });
        if (res.ok) {
            alert(idEditar ? "Producto Actualizado" : "Producto Creado");
            setFormProd({ nombre: '', precio: '', categoria: 'Pasteles', descripcion: '', stock: 20 });
            setArchivoImagen(null);
            setIdEditar(null);
            cargarProductos();
        }
    } catch (e) {}
  };

  const eliminarProducto = async (id) => {
    if(!window.confirm("¿Eliminar este producto?")) return;
    await fetch(`http://localhost:8080/api/productos/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${getToken()}` } });
    cargarProductos();
  };

  const manejarSubmitUsuario = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` },
        body: JSON.stringify(formUser)
    });
    setFormUser({ nombre: '', email: '', password: '', rol: 'cliente' });
    cargarUsuarios();
  };

  const eliminarUsuario = async (id) => {
    if(!window.confirm("¿Bloquear usuario?")) return;
    await fetch(`http://localhost:8080/api/usuarios/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${getToken()}` } });
    cargarUsuarios();
  };

  if (cargando) return <div>Cargando...</div>;
  if (!accesoAutorizado) return null;

  const renderContenido = () => {
    if (vista === 'productos') return (
        <div className="admin-card">
            <h3 style={{marginTop:0, color:'#4e342e'}}>📦 Inventario</h3>
            <form onSubmit={manejarSubmitProducto} className="form-grid">
                <input className="form-control" name="nombre" placeholder="Nombre" value={formProd.nombre} onChange={e => setFormProd({...formProd, nombre: e.target.value})} required />
                <input className="form-control" name="precio" type="number" placeholder="Precio" value={formProd.precio} onChange={e => setFormProd({...formProd, precio: e.target.value})} required />
                <input className="form-control" name="stock" type="number" placeholder="Stock" value={formProd.stock} onChange={e => setFormProd({...formProd, stock: e.target.value})} required />
                <select className="form-control" name="categoria" value={formProd.categoria} onChange={e => setFormProd({...formProd, categoria: e.target.value})}>
                    <option>Pasteles</option><option>Tortas</option><option>Reposteria</option>
                </select>
                <textarea className="form-control" style={{gridColumn: 'span 2'}} name="descripcion" placeholder="Descripción" value={formProd.descripcion} onChange={e => setFormProd({...formProd, descripcion: e.target.value})} />
                <div style={{gridColumn: 'span 2'}}>
                    <input type="file" onChange={e => setArchivoImagen(e.target.files[0])} accept="image/*" />
                </div>
                <button type="submit" className="btn-main" style={{gridColumn: 'span 2'}}>
                    {idEditar ? "Guardar Cambios" : "Agregar Producto"}
                </button>
                {idEditar && <button type="button" onClick={()=>{setIdEditar(null); setFormProd({ nombre: '', precio: '', categoria: 'Pasteles', descripcion: '', stock: 20 })}} style={{gridColumn:'span 2', background:'transparent', border:'none', color:'red', cursor:'pointer'}}>Cancelar Edición</button>}
            </form>
            <table className="admin-table">
                <thead><tr><th>Img</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
                <tbody>
                    {listaProductos.map(p => (
                        <tr key={p.id}>
                            <td>{p.imagenUrl ? <img src={`http://localhost:8080${p.imagenUrl}`} alt="prod" width="40" style={{borderRadius:'5px'}}/> : '🧁'}</td>
                            <td>{p.nombre}</td>
                            <td>${Number(p.precio).toLocaleString('es-CL')}</td>
                            <td>{p.stock}</td>
                            <td>
                                <button className="action-btn" onClick={() => {setFormProd(p); setIdEditar(p.id)}} title="Editar">✏️</button>
                                <button className="action-btn" onClick={() => eliminarProducto(p.id)} title="Borrar">🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    if (vista === 'ventas') return (
        <div className="admin-card">
            <h3>💰 Ventas</h3>
            <table className="admin-table">
                <thead><tr><th>ID</th><th>Cliente</th><th>Total</th><th>Detalle</th></tr></thead>
                <tbody>
                    {listaVentas.map(v => (
                        <tr key={v.id}>
                            <td>#{v.id}</td>
                            <td>{v.nombreCliente}</td>
                            <td>${Number(v.total).toLocaleString('es-CL')}</td>
                            <td><button className="btn-main" style={{fontSize:'0.8rem', padding:'5px 10px'}} onClick={() => setVentaSeleccionada(v)}>Ver Ticket</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    if (vista === 'usuarios') return (
        <div className="admin-card">
            <h3>👥 Usuarios</h3>
            <form onSubmit={manejarSubmitUsuario} style={{marginBottom:'20px', display:'flex', gap:'10px'}}>
                <input className="form-control" placeholder="Nombre" onChange={e => setFormUser({...formUser, nombre: e.target.value})} />
                <input className="form-control" placeholder="Email" onChange={e => setFormUser({...formUser, email: e.target.value})} />
                <input className="form-control" type="password" placeholder="Clave" onChange={e => setFormUser({...formUser, password: e.target.value})} />
                <select className="form-control" onChange={e => setFormUser({...formUser, rol: e.target.value})}>
                    <option value="cliente">Cliente</option><option value="admin">Admin</option>
                </select>
                <button className="btn-main">Crear</button>
            </form>
            <table className="admin-table">
                <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Acción</th></tr></thead>
                <tbody>
                    {listaUsuarios.map(u => (
                        <tr key={u.id}><td>{u.nombre}</td><td>{u.email}</td>
                        <td>{u.rol}</td>
                        <td><button className="action-btn" onClick={() => eliminarUsuario(u.id)}>🗑️</button></td></tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
  };

  return (
    <div className="admin-layout"> 
        <aside className="admin-sidebar">
            <div className="admin-logo">UMAI ADMIN</div>
            <button className={`nav-btn ${vista==='productos'?'active':''}`} onClick={()=>setVista('productos')}>📦 Inventario</button>
            <button className={`nav-btn ${vista==='ventas'?'active':''}`} onClick={()=>setVista('ventas')}>💰 Ventas</button>
            <button className={`nav-btn ${vista==='usuarios'?'active':''}`} onClick={()=>setVista('usuarios')}>👥 Usuarios</button>
            <div className="menu-separator"></div>
            <button className="nav-btn btn-logout" onClick={() => { localStorage.clear(); navigate('/login'); }}>🚪 Cerrar Sesión</button>
        </aside>

        <main className="admin-content">
            {renderContenido()}
        </main>

        {/* --- MODAL DE TICKET RESTAURADO Y MEJORADO --- */}
        {ventaSeleccionada && (
            <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:999}}>
                <div style={{background:'white', padding:'30px', borderRadius:'15px', width:'380px', boxShadow:'0 10px 30px rgba(0,0,0,0.3)', border:'5px solid #fff', outline:'1px dashed #e85a9d'}}>
                    
                    {/* Encabezado del Ticket */}
                    <div style={{textAlign:'center', marginBottom:'20px', borderBottom:'2px dashed #eee', paddingBottom:'10px'}}>
                        <h2 style={{fontFamily:'Pacifico, cursive', margin:0, color:'#e85a9d'}}>Pastelería Umai</h2>
                        <p style={{margin:0, fontSize:'0.9rem', color:'#888'}}>Ticket de Venta #{ventaSeleccionada.id}</p>
                    </div>

                    <p style={{fontSize:'0.9rem'}}><strong>Cliente:</strong> {ventaSeleccionada.nombreCliente}</p>

                    {/* Lista de Productos (Restaurada lógica del split) */}
                    <div style={{background:'#fcfcfc', padding:'10px', borderRadius:'8px', margin:'15px 0', border:'1px solid #eee', maxHeight:'200px', overflowY:'auto'}}>
                        <h6 style={{marginTop:0, color:'#4e342e', borderBottom:'1px solid #ddd', paddingBottom:'5px'}}>Detalle del Consumo:</h6>
                        <ul style={{paddingLeft:'20px', margin:0, fontSize:'0.9rem', color:'#555'}}>
                            {ventaSeleccionada.detalleCompra ? (
                                ventaSeleccionada.detalleCompra.split(',').map((item, index) => (
                                    <li key={index} style={{marginBottom:'5px'}}>{item.trim()}</li>
                                ))
                            ) : (
                                <li>Sin detalle disponible</li>
                            )}
                        </ul>
                    </div>

                    {/* Cálculos Fiscales (Restaurados) */}
                    <div style={{textAlign:'right', fontSize:'0.9rem', color:'#666'}}>
                        {(() => {
                             const total = Number(ventaSeleccionada.total);
                             const neto = Math.round(total / 1.19);
                             const iva = total - neto;
                             return (
                                 <>
                                     <div style={{display:'flex', justifyContent:'space-between'}}><span>Neto:</span><span>${neto.toLocaleString('es-CL')}</span></div>
                                     <div style={{display:'flex', justifyContent:'space-between'}}><span>IVA (19%):</span><span>${iva.toLocaleString('es-CL')}</span></div>
                                     <div style={{display:'flex', justifyContent:'space-between', fontSize:'1.2rem', fontWeight:'bold', color:'#27ae60', marginTop:'10px', borderTop:'1px solid #eee', paddingTop:'5px'}}>
                                         <span>TOTAL:</span>
                                         <span>${total.toLocaleString('es-CL')}</span>
                                     </div>
                                 </>
                             );
                        })()}
                    </div>

                    <button onClick={() => setVentaSeleccionada(null)} className="btn-main" style={{width:'100%', marginTop:'20px', background:'#e85a9d', boxShadow:'none'}}>Cerrar Ticket</button>
                </div>
            </div>
        )}
    </div>
  );
};

export default Admin;