import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productos as dataInicial } from '../data'; // Tu data base
import '../styles/admin.css';

const Admin = () => {
  const navigate = useNavigate();
  
  // ESTADO: ¿Qué pestaña estamos viendo? 
  // Opciones: 'productos', 'usuarios', 'nuevo_prod', 'nuevo_user', 'ayuda'
  const [vista, setVista] = useState('productos');
  
  // ESTADOS DE DATOS (Simulando Base de Datos)
  const [listaProductos, setListaProductos] = useState([]);
  const [listaUsuarios, setListaUsuarios] = useState([]);

  // FORMULARIOS (Estados temporales)
  const [formProd, setFormProd] = useState({ nombre: '', precio: '', categoria: 'Pasteles', imagen: '', descripcion: '' });
  const [formUser, setFormUser] = useState({ nombre: '', email: '', rol: 'trab' });

  // 1. CARGAR DATOS AL INICIO
  useEffect(() => {
    // Seguridad básica
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) { navigate('/login'); return; }

    // Cargar Productos
    const prodsGuardados = JSON.parse(localStorage.getItem("productos_db"));
    if (prodsGuardados) setListaProductos(prodsGuardados);
    else {
        setListaProductos(dataInicial);
        localStorage.setItem("productos_db", JSON.stringify(dataInicial));
    }

    // Cargar Usuarios (Dummy data si está vacío)
    const usersGuardados = JSON.parse(localStorage.getItem("usuarios_db")) || [
        { id: 1, nombre: "Admin Supremo", email: "admin@umai.com", rol: "admin" },
        { id: 2, nombre: "Juan Pastelero", email: "juan@umai.com", rol: "trab" }
    ];
    setListaUsuarios(usersGuardados);
  }, [navigate]);

  // --- LÓGICA DE PRODUCTOS ---
  const guardarProducto = (e) => {
    e.preventDefault();
    const nuevo = { ...formProd, id: "NUEVO" + Date.now(), precio: Number(formProd.precio) };
    const actualizada = [...listaProductos, nuevo];
    setListaProductos(actualizada);
    localStorage.setItem("productos_db", JSON.stringify(actualizada));
    alert("¡Producto Guardado! 🍰");
    setFormProd({ nombre: '', precio: '', categoria: 'Pasteles', imagen: '', descripcion: '' }); // Reset
    setVista('productos'); // Volver a la lista
  };

  const eliminarProducto = (id) => {
    if(!window.confirm("¿Borrar pastel?")) return;
    const filtrada = listaProductos.filter(p => p.id !== id);
    setListaProductos(filtrada);
    localStorage.setItem("productos_db", JSON.stringify(filtrada));
  };

  // --- LÓGICA DE USUARIOS ---
  const guardarUsuario = (e) => {
    e.preventDefault();
    const nuevo = { ...formUser, id: Date.now() };
    const actualizada = [...listaUsuarios, nuevo];
    setListaUsuarios(actualizada);
    localStorage.setItem("usuarios_db", JSON.stringify(actualizada));
    alert("¡Usuario Registrado! 👤");
    setFormUser({ nombre: '', email: '', rol: 'trab' });
    setVista('usuarios');
  };

  const eliminarUsuario = (id) => {
    if(!window.confirm("¿Eliminar acceso a este usuario?")) return;
    const filtrada = listaUsuarios.filter(u => u.id !== id);
    setListaUsuarios(filtrada);
    localStorage.setItem("usuarios_db", JSON.stringify(filtrada));
  };

  // --- RENDERIZADO DEL CONTENIDO DINÁMICO ---
  const renderContenido = () => {
    switch (vista) {
      // 1. LISTA DE PRODUCTOS
      case 'productos':
        return (
          <div className="admin-card">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>📦 Inventario de Productos</h3>
                <button className="btn-crear" onClick={() => setVista('nuevo_prod')}>+ Nuevo Producto</button>
            </div>
            <table className="admin-table">
              <thead><tr><th>Img</th><th>Nombre</th><th>Precio</th><th>Categoría</th><th>Acción</th></tr></thead>
              <tbody>
                {listaProductos.map(p => (
                  <tr key={p.id}>
                    <td><img src={p.imagen.startsWith('/') ? p.imagen : `/${p.imagen}`} alt="min" className="img-mini"/></td>
                    <td>{p.nombre}</td>
                    <td>${Number(p.precio).toLocaleString('es-CL')}</td>
                    <td><span className="badge bg-warning text-dark">{p.categoria}</span></td>
                    <td><button className="btn-action btn-borrar" onClick={() => eliminarProducto(p.id)}>🗑️</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      // 2. NUEVO PRODUCTO
      case 'nuevo_prod':
        return (
          <div className="admin-card" style={{maxWidth: '800px'}}>
             <h3>🍰 Agregar Nuevo Pastel</h3>
             <form onSubmit={guardarProducto} className="mt-4">
               <div className="form-grid">
                 <div className="input-group">
                    <label>Nombre</label>
                    <input required type="text" value={formProd.nombre} onChange={e=>setFormProd({...formProd, nombre: e.target.value})}/>
                 </div>
                 <div className="input-group">
                    <label>Precio ($)</label>
                    <input required type="number" value={formProd.precio} onChange={e=>setFormProd({...formProd, precio: e.target.value})}/>
                 </div>
                 <div className="input-group">
                    <label>Categoría</label>
                    <select value={formProd.categoria} onChange={e=>setFormProd({...formProd, categoria: e.target.value})}>
                        <option>Pasteles</option><option>Tartaletas</option><option>Bollería</option><option>Sin Azúcar</option>
                    </select>
                 </div>
                 <div className="input-group">
                    <label>Ruta Imagen (ej: img/pastel.png)</label>
                    <input required type="text" value={formProd.imagen} onChange={e=>setFormProd({...formProd, imagen: e.target.value})}/>
                 </div>
               </div>
               <div className="input-group mt-3">
                  <label>Descripción</label>
                  <textarea rows="3" value={formProd.descripcion} onChange={e=>setFormProd({...formProd, descripcion: e.target.value})}/>
               </div>
               <div className="mt-4 d-flex gap-2">
                 <button type="submit" className="btn-crear">Guardar</button>
                 <button type="button" className="btn-action" onClick={()=>setVista('productos')}>Cancelar</button>
               </div>
             </form>
          </div>
        );

      // 3. LISTA DE USUARIOS
      case 'usuarios':
        return (
            <div className="admin-card">
              <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3>👥 Gestión de Usuarios</h3>
                  <button className="btn-crear" onClick={() => setVista('nuevo_user')}>+ Nuevo Usuario</button>
              </div>
              <table className="admin-table">
                <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Acción</th></tr></thead>
                <tbody>
                  {listaUsuarios.map(u => (
                    <tr key={u.id}>
                      <td>{u.nombre}</td>
                      <td>{u.email}</td>
                      <td>{u.rol === 'admin' ? '👑 Admin' : '👷 Trabajador'}</td>
                      <td>
                        {u.rol !== 'admin' && (
                            <button className="btn-action btn-borrar" onClick={() => eliminarUsuario(u.id)}>Bloquear</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        );

      // 4. NUEVO USUARIO
      case 'nuevo_user':
        return (
            <div className="admin-card" style={{maxWidth: '500px'}}>
                <h3>👤 Registrar Empleado</h3>
                <form onSubmit={guardarUsuario} className="mt-4">
                    <div className="input-group mb-3">
                        <label>Nombre Completo</label>
                        <input required type="text" value={formUser.nombre} onChange={e=>setFormUser({...formUser, nombre: e.target.value})}/>
                    </div>
                    <div className="input-group mb-3">
                        <label>Email</label>
                        <input required type="email" value={formUser.email} onChange={e=>setFormUser({...formUser, email: e.target.value})}/>
                    </div>
                    <div className="input-group mb-3">
                        <label>Rol</label>
                        <select value={formUser.rol} onChange={e=>setFormUser({...formUser, rol: e.target.value})}>
                            <option value="trab">Trabajador</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <div className="mt-4 d-flex gap-2">
                        <button type="submit" className="btn-crear">Registrar</button>
                        <button type="button" className="btn-action" onClick={()=>setVista('usuarios')}>Cancelar</button>
                    </div>
                </form>
            </div>
        );

      // 5. AYUDA
      case 'ayuda':
        return (
            <div className="admin-card">
                <h3>🆘 Centro de Ayuda</h3>
                <p className="mb-4 text-muted">Contacta al equipo de soporte técnico.</p>
                <div className="support-grid">
                    <div className="support-card">
                        <span className="avatar">👨‍💻</span>
                        <h4>Lorenzo</h4>
                        <span className="role">Soporte Técnico</span>
                        <p className="mt-2">lorenzo@umai.cl</p>
                    </div>
                    <div className="support-card">
                        <span className="avatar">🔧</span>
                        <h4>Valentín</h4>
                        <span className="role">Ing. Sistemas</span>
                        <p className="mt-2">valentin@umai.cl</p>
                    </div>
                    <div className="support-card">
                        <span className="avatar">🛡️</span>
                        <h4>Millaray</h4>
                        <span className="role">Seguridad</span>
                        <p className="mt-2">millaray@umai.cl</p>
                    </div>
                </div>
            </div>
        );

      default: return null;
    }
  };

  // --- RENDERIZADO PRINCIPAL (LAYOUT) ---
  return (
    <div className="admin-layout">
        {/* SIDEBAR */}
        <aside className="admin-sidebar">
            <div className="admin-logo">¡Umai! Admin 🧁</div>
            
            <div className="nav-section">
                <p className="nav-label">Gestión</p>
                <button className={`nav-btn ${vista === 'productos' ? 'active' : ''}`} onClick={()=>setVista('productos')}>📦 Productos</button>
                <button className={`nav-btn ${vista === 'usuarios' ? 'active' : ''}`} onClick={()=>setVista('usuarios')}>👥 Usuarios</button>
            </div>

            <div className="nav-section">
                <p className="nav-label">Sistema</p>
                <button className={`nav-btn ${vista === 'ayuda' ? 'active' : ''}`} onClick={()=>setVista('ayuda')}>❓ Ayuda</button>
            </div>

            <div className="nav-section" style={{marginTop: 'auto'}}>
                <button className="nav-btn" onClick={() => navigate('/')}>🏠 Ver Sitio Web</button>
                <button className="nav-btn btn-logout" onClick={() => { localStorage.removeItem('isAdmin'); navigate('/login'); }}>🚪 Cerrar Sesión</button>
            </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="admin-content">
            <div className="content-header">
                <h1>Panel de Control</h1>
                <p className="text-muted">Bienvenido de nuevo, Administrador.</p>
            </div>
            {renderContenido()}
        </main>
    </div>
  );
};

export default Admin;