import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/admin.css';

const Admin = () => {
  const navigate = useNavigate();
  
  // 🔒 ESTADOS DE SEGURIDAD
  const [accesoAutorizado, setAccesoAutorizado] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Estados de datos
  const [vista, setVista] = useState('productos');
  const [listaProductos, setListaProductos] = useState([]);
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [listaVentas, setListaVentas] = useState([]);

  // Estado para Edición
  const [idEditar, setIdEditar] = useState(null);

  // Estado para el MODAL DE DETALLE (Ventana emergente) 🆕
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  // Formularios
  const [formProd, setFormProd] = useState({ nombre: '', precio: '', categoria: 'Pasteles', descripcion: '' });
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [formUser, setFormUser] = useState({ nombre: '', email: '', password: '', rol: 'cliente' });

  // --- 1. VERIFICACIÓN DE SEGURIDAD ---
  useEffect(() => {
    const verificarPermisos = () => {
        const usuarioStorage = localStorage.getItem("usuario");
        
        if (!usuarioStorage) {
            navigate('/login');
            return;
        }

        const usuario = JSON.parse(usuarioStorage);

        if (usuario.rol !== 'admin') {
            navigate('/');
            return;
        }

        setAccesoAutorizado(true);
        setCargando(false);
        cargarProductos();
        cargarUsuarios();
        cargarVentas(); 
    };

    verificarPermisos();
  }, [navigate]);

  // --- API REQUESTS ---
  const cargarProductos = async () => {
    try {
        const res = await fetch("http://localhost:8080/api/productos");
        const data = await res.json();
        setListaProductos(data);
    } catch (e) { console.error(e); }
  };

  const cargarUsuarios = async () => {
    try {
        const res = await fetch("http://localhost:8080/api/usuarios");
        const data = await res.json();
        setListaUsuarios(data);
    } catch (e) { console.error(e); }
  };

  const cargarVentas = async () => {
    try {
        const res = await fetch("http://localhost:8080/api/compras");
        const data = await res.json();
        setListaVentas(data.reverse()); // Las más recientes primero
    } catch (e) { console.error(e); }
  };

  // --- HANDLERS PRODUCTOS ---
  const handleGuardarProducto = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("nombre", formProd.nombre);
      formData.append("precio", formProd.precio);
      formData.append("categoria", formProd.categoria);
      formData.append("descripcion", formProd.descripcion);
      if (archivoImagen) formData.append("file", archivoImagen);

      await fetch("http://localhost:8080/api/productos", { method: "POST", body: formData });
      alert("¡Producto Creado!");
      cargarProductos();
      setVista('productos');
      limpiarFormProd();
  };

  const handleEditarProducto = (prod) => {
      setIdEditar(prod.id);
      setFormProd({
          nombre: prod.nombre,
          precio: prod.precio,
          categoria: prod.categoria,
          descripcion: prod.descripcion
      });
      setVista('editar_prod');
  };

  const handleActualizarProducto = async (e) => {
    e.preventDefault();
    if (!idEditar) { alert("Error: ID no encontrado."); return; }

    const formData = new FormData();
    formData.append("nombre", formProd.nombre);
    formData.append("precio", formProd.precio);
    formData.append("categoria", formProd.categoria);
    formData.append("descripcion", formProd.descripcion);
    if (archivoImagen) formData.append("file", archivoImagen);

    try {
        const response = await fetch(`http://localhost:8080/api/productos/${idEditar}`, { 
            method: "PUT", 
            body: formData 
        });
        if (!response.ok) throw new Error("Error server");
        
        alert("¡Producto Actualizado!");
        cargarProductos();
        setVista('productos');
        limpiarFormProd();
    } catch (error) {
        console.error(error);
        alert("Error al actualizar producto.");
    }
};

  const handleEliminarProducto = async (id) => {
      if(window.confirm("¿Eliminar producto?")) {
          await fetch(`http://localhost:8080/api/productos/${id}`, { method: "DELETE" });
          cargarProductos();
      }
  };

  const limpiarFormProd = () => {
      setFormProd({ nombre: '', precio: '', categoria: 'Pasteles', descripcion: '' });
      setArchivoImagen(null);
      setIdEditar(null);
  }

  // --- HANDLERS USUARIOS ---
  const handleGuardarUsuario = async (e) => {
      e.preventDefault();
      await fetch("http://localhost:8080/api/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formUser)
      });
      alert("Usuario creado");
      cargarUsuarios();
      setVista('usuarios');
      limpiarFormUser();
  };

  const handleEditarUsuario = (user) => {
    setIdEditar(user.id);
    setFormUser({
        nombre: user.nombre,
        email: user.email,
        password: '',
        rol: user.rol
    });
    setVista('editar_user');
  };

  const handleActualizarUsuario = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:8080/api/usuarios/${idEditar}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formUser)
    });
    alert("Usuario actualizado");
    cargarUsuarios();
    setVista('usuarios');
    limpiarFormUser();
  };

  const handleEliminarUsuario = async (id) => {
      if(window.confirm("¿Eliminar usuario?")) {
          await fetch(`http://localhost:8080/api/usuarios/${id}`, { method: "DELETE" });
          cargarUsuarios();
      }
  };

  const limpiarFormUser = () => {
      setFormUser({ nombre: '', email: '', password: '', rol: 'cliente' });
      setIdEditar(null);
  }

  if (cargando || !accesoAutorizado) return null; 

  // --- RENDERIZADO ---
  const renderContenido = () => {
    switch (vista) {
      case 'productos':
        return (
          <div className="admin-card">
            <div className="d-flex justify-content-between mb-4">
                <h3>📦 Inventario</h3>
                <button className="btn-crear" onClick={() => { limpiarFormProd(); setVista('nuevo_prod'); }}>+ Nuevo</button>
            </div>
            <table className="admin-table">
              <thead><tr><th>Img</th><th>Nombre</th><th>Precio</th><th>Acciones</th></tr></thead>
              <tbody>
                {listaProductos.map(p => (
                  <tr key={p.id}>
                    <td><img src={p.imagen} alt="prod" style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px'}}/></td>
                    <td>{p.nombre}</td>
                    <td>${Number(p.precio).toLocaleString('es-CL')}</td>
                    <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditarProducto(p)}>✏️</button>
                        <button className="btn-borrar" onClick={() => handleEliminarProducto(p.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'usuarios':
        return (
            <div className="admin-card">
              <div className="d-flex justify-content-between mb-4">
                  <h3>👥 Usuarios</h3>
                  <button className="btn-crear" onClick={() => { limpiarFormUser(); setVista('nuevo_user'); }}>+ Nuevo</button>
              </div>
              <table className="admin-table">
                <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th></tr></thead>
                <tbody>
                  {listaUsuarios.map(u => (
                    <tr key={u.id}>
                      <td>{u.nombre}</td>
                      <td>{u.email}</td>
                      <td>{u.rol === 'admin' ? <span className="badge bg-warning text-dark">Admin</span> : <span className="badge bg-light text-dark">Cliente</span>}</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditarUsuario(u)}>✏️</button>
                        <button className="btn-borrar" onClick={() => handleEliminarUsuario(u.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        );
      
      // --- VISTA VENTAS (MODIFICADA) ---
      case 'ventas':
        return (
            <div className="admin-card">
              <h3>💰 Historial de Ventas</h3>
              <table className="admin-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Detalle</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                  {listaVentas.map(v => (
                    <tr key={v.id}>
                      <td>{v.fecha}</td>
                      <td>
                          <strong>{v.nombreCliente}</strong><br/>
                          <small className="text-muted">{v.emailCliente}</small>
                      </td>
                      {/* BOTÓN PARA ABRIR MODAL */}
                      <td>
                          <button 
                            className="btn btn-sm btn-info text-white" 
                            onClick={() => setVentaSeleccionada(v)}
                          >
                             👁️ Ver Productos
                          </button>
                      </td>
                      <td style={{color: '#2ecc71', fontWeight: 'bold'}}>${Number(v.total).toLocaleString('es-CL')}</td>
                    </tr>
                  ))}
                  {listaVentas.length === 0 && (
                      <tr><td colSpan="4" className="text-center p-3">Aún no hay ventas registradas.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
        );

      case 'nuevo_prod':
          return (
             <div className="admin-card">
                 <h3>🍰 Nuevo Producto</h3>
                 <form onSubmit={handleGuardarProducto} className="mt-3 d-flex flex-column gap-3">
                     <input className="form-control" placeholder="Nombre" value={formProd.nombre} onChange={e => setFormProd({...formProd, nombre: e.target.value})} required/>
                     <input className="form-control" type="number" placeholder="Precio" value={formProd.precio} onChange={e => setFormProd({...formProd, precio: e.target.value})} required/>
                     <select className="form-control" value={formProd.categoria} onChange={e => setFormProd({...formProd, categoria: e.target.value})}>
                        <option>Pasteles</option><option>Tortas</option><option>Galletas</option>
                     </select>
                     <textarea className="form-control" placeholder="Descripción" value={formProd.descripcion} onChange={e => setFormProd({...formProd, descripcion: e.target.value})} />
                     <input className="form-control" type="file" onChange={e => setArchivoImagen(e.target.files[0])} />
                     <div className="d-flex gap-2">
                        <button type="submit" className="btn-crear">Guardar</button>
                        <button type="button" className="btn btn-secondary" onClick={()=>setVista('productos')}>Cancelar</button>
                     </div>
                 </form>
             </div>
          );

      case 'editar_prod':
          return (
             <div className="admin-card" style={{borderLeft: '5px solid #ffc107'}}>
                 <h3>✏️ Editar Producto</h3>
                 <form onSubmit={handleActualizarProducto} className="mt-3 d-flex flex-column gap-3">
                     <input className="form-control" placeholder="Nombre" value={formProd.nombre} onChange={e => setFormProd({...formProd, nombre: e.target.value})} required/>
                     <input className="form-control" type="number" placeholder="Precio" value={formProd.precio} onChange={e => setFormProd({...formProd, precio: e.target.value})} required/>
                     <select className="form-control" value={formProd.categoria} onChange={e => setFormProd({...formProd, categoria: e.target.value})}>
                        <option>Pasteles</option><option>Tortas</option><option>Galletas</option>
                     </select>
                     <textarea className="form-control" placeholder="Descripción" value={formProd.descripcion} onChange={e => setFormProd({...formProd, descripcion: e.target.value})} />
                     <label className="text-muted small">Subir nueva imagen (opcional):</label>
                     <input className="form-control" type="file" onChange={e => setArchivoImagen(e.target.files[0])} />
                     <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-warning">Actualizar</button>
                        <button type="button" className="btn btn-secondary" onClick={()=>setVista('productos')}>Cancelar</button>
                     </div>
                 </form>
             </div>
          );

      case 'nuevo_user':
            return (
               <div className="admin-card">
                   <h3>👤 Nuevo Usuario</h3>
                   <form onSubmit={handleGuardarUsuario} className="mt-3 d-flex flex-column gap-3">
                       <input className="form-control" placeholder="Nombre" value={formUser.nombre} onChange={e => setFormUser({...formUser, nombre: e.target.value})} required/>
                       <input className="form-control" type="email" placeholder="Email" value={formUser.email} onChange={e => setFormUser({...formUser, email: e.target.value})} required/>
                       <input className="form-control" type="password" placeholder="Contraseña" value={formUser.password} onChange={e => setFormUser({...formUser, password: e.target.value})} required/>
                       <select className="form-control" value={formUser.rol} onChange={e => setFormUser({...formUser, rol: e.target.value})}>
                          <option value="cliente">Cliente</option>
                          <option value="admin">Administrador</option>
                       </select>
                       <div className="d-flex gap-2">
                           <button type="submit" className="btn-crear">Guardar</button>
                           <button type="button" className="btn btn-secondary" onClick={()=>setVista('usuarios')}>Cancelar</button>
                       </div>
                   </form>
               </div>
            );

      case 'editar_user':
            return (
               <div className="admin-card" style={{borderLeft: '5px solid #ffc107'}}>
                   <h3>✏️ Editar Usuario</h3>
                   <form onSubmit={handleActualizarUsuario} className="mt-3 d-flex flex-column gap-3">
                       <input className="form-control" placeholder="Nombre" value={formUser.nombre} onChange={e => setFormUser({...formUser, nombre: e.target.value})} required/>
                       <input className="form-control" type="email" placeholder="Email" value={formUser.email} onChange={e => setFormUser({...formUser, email: e.target.value})} required/>
                       <input className="form-control" type="password" placeholder="Nueva Contraseña" value={formUser.password} onChange={e => setFormUser({...formUser, password: e.target.value})} />
                       <select className="form-control" value={formUser.rol} onChange={e => setFormUser({...formUser, rol: e.target.value})}>
                          <option value="cliente">Cliente</option>
                          <option value="admin">Administrador</option>
                       </select>
                       <div className="d-flex gap-2">
                           <button type="submit" className="btn btn-warning">Actualizar</button>
                           <button type="button" className="btn btn-secondary" onClick={()=>setVista('usuarios')}>Cancelar</button>
                       </div>
                   </form>
               </div>
            );

      default: return null;
    }
  };

  return (
    <div className="admin-layout">
        {/* ESTILOS DEL MODAL INTEGRADOS */}
        <style>{`
            .modal-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(0,0,0,0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .modal-content {
                background: white;
                padding: 25px;
                border-radius: 10px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                position: relative;
            }
            .lista-detalle {
                list-style: none;
                padding: 0;
                margin: 15px 0;
            }
            .lista-detalle li {
                background: #f8f9fa;
                border-bottom: 1px solid #ddd;
                padding: 8px;
            }
            .btn-cerrar-modal {
                background: #e74c3c;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
                float: right;
            }
        `}</style>

        <aside className="admin-sidebar">
            <div className="admin-logo">¡Umai! Admin 🛡️</div>
            
            <nav className="d-flex flex-column gap-2 w-100">
                <button className={`nav-btn ${vista.includes('productos') ? 'active':''}`} onClick={()=>setVista('productos')}>📦 Inventario</button>
                <button className={`nav-btn ${vista.includes('usuarios') ? 'active':''}`} onClick={()=>setVista('usuarios')}>👥 Usuarios</button>
                <button className={`nav-btn ${vista==='ventas' ? 'active':''}`} onClick={()=>setVista('ventas')}>💰 Ventas</button>
            </nav>

            <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid rgba(255,255,255,0.3)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button className="nav-btn btn-home" onClick={() => navigate('/')}>🏠 Inicio</button>
                <button className="nav-btn btn-logout" onClick={() => { 
                    localStorage.removeItem('usuario'); 
                    navigate('/login'); 
                }}>🚪 Salir</button>
            </div>
        </aside>
        
        <main className="admin-content">
            {renderContenido()}
        </main>

        {/* --- COMPONENTE VISUAL DEL MODAL --- */}
        {ventaSeleccionada && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h4 style={{ color: '#4e342e' }}>🧾 Detalle de Pedido #{ventaSeleccionada.id}</h4>
                    <p className="text-muted mb-1"><strong>Cliente:</strong> {ventaSeleccionada.nombreCliente}</p>
                    <p className="text-muted small">{ventaSeleccionada.emailCliente}</p>
                    <hr/>
                    
                    <h6 className="mb-3">Productos:</h6>
                    <ul className="lista-detalle">
                        {ventaSeleccionada.detalleCompra.split(',').map((item, index) => (
                            <li key={index}>{item.trim()}</li>
                        ))}
                    </ul>

                    <h4 className="text-end text-success mt-3">
                        Total: ${Number(ventaSeleccionada.total).toLocaleString('es-CL')}
                    </h4>

                    <button className="btn-cerrar-modal" onClick={() => setVentaSeleccionada(null)}>
                        Cerrar
                    </button>
                </div>
            </div>
        )}

    </div>
  );
};

export default Admin;