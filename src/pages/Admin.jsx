import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Importamos las funciones que conectan con Spring Boot
import { obtenerProductos, crearProducto, eliminarProducto } from '../services/api'; 
import '../styles/admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [vista, setVista] = useState('productos');

  const [listaProductos, setListaProductos] = useState([]);
  const [listaUsuarios, setListaUsuarios] = useState([]);

  // Estado del formulario
  const [formProd, setFormProd] = useState({ 
    nombre: '', 
    precio: '', 
    categoria: 'Pasteles', 
    imagen: '', 
    descripcion: '' 
  });

  const [formUser, setFormUser] = useState({ nombre: '', email: '', rol: 'trab' });

  // 1. Al cargar la página, pedimos los datos al Backend
  useEffect(() => {
    // Seguridad básica
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) { navigate('/login'); return; }

    cargarProductosDesdeBD();
    cargarUsuariosLocales();
  }, [navigate]);

  // Función auxiliar para traer productos frescos de la BD
  const cargarProductosDesdeBD = async () => {
    const datos = await obtenerProductos();
    setListaProductos(datos);
  };

  // Mantener usuarios en localStorage (por ahora, ya que no hicimos backend de usuarios)
  const cargarUsuariosLocales = () => {
    const usersGuardados = JSON.parse(localStorage.getItem("usuarios_db")) || [
        { id: 1, nombre: "Admin Supremo", email: "admin@umai.com", rol: "admin" },
        { id: 2, nombre: "Juan Pastelero", email: "juan@umai.com", rol: "trab" }
    ];
    setListaUsuarios(usersGuardados);
  };

  // 2. GUARDAR PRODUCTO (POST al Backend)
  const handleGuardarProducto = async (e) => {
    e.preventDefault();
    
    // Preparamos el objeto para enviar a Java
    // OJO: No le ponemos ID, la base de datos lo pondrá sola
    const nuevoProducto = { 
        nombre: formProd.nombre,
        precio: Number(formProd.precio), // Aseguramos que sea número
        categoria: formProd.categoria,
        imagen: formProd.imagen,
        descripcion: formProd.descripcion
    };

    // Llamamos a la API
    const resultado = await crearProducto(nuevoProducto);

    if (resultado) {
        alert("¡Producto Guardado en Base de Datos! 🍰");
        cargarProductosDesdeBD(); // Recargamos la lista para ver el cambio
        // Limpiamos el formulario
        setFormProd({ nombre: '', precio: '', categoria: 'Pasteles', imagen: '', descripcion: '' });
        setVista('productos'); 
    } else {
        alert("Hubo un error al guardar");
    }
  };

  // 3. ELIMINAR PRODUCTO (DELETE al Backend)
  const handleEliminarProducto = async (id) => {
    if(!window.confirm("¿Seguro que quieres borrar este pastel de la Base de Datos?")) return;
    
    const exito = await eliminarProducto(id);
    if (exito) {
        cargarProductosDesdeBD(); // Recargamos la lista
    } else {
        alert("Error al eliminar");
    }
  };

  // (Gestión de usuarios se mantiene local por ahora)
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


  const renderContenido = () => {
    switch (vista) {

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
                    <td>
                        {/* Ajuste para ver imágenes web o locales */}
                        <img 
                            src={p.imagen} 
                            alt="min" 
                            className="img-mini"
                            onError={(e) => e.target.src = "https://via.placeholder.com/50"} 
                        />
                    </td>
                    <td>{p.nombre}</td>
                    <td>${Number(p.precio).toLocaleString('es-CL')}</td>
                    <td><span className="badge bg-warning text-dark">{p.categoria}</span></td>
                    <td>
                        <button className="btn-action btn-borrar" onClick={() => handleEliminarProducto(p.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );


      case 'nuevo_prod':
        return (
          <div className="admin-card" style={{maxWidth: '800px'}}>
             <h3>🍰 Agregar Nuevo Pastel a BD</h3>
             <form onSubmit={handleGuardarProducto} className="mt-4">
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
                        <option>Pasteles</option><option>Tortas</option><option>Cupcakes</option><option>Sin Azúcar</option>
                    </select>
                 </div>
                 <div className="input-group">
                    <label>URL de Imagen (https://...)</label>
                    <input required type="text" placeholder="Pega un link de imagen aquí" value={formProd.imagen} onChange={e=>setFormProd({...formProd, imagen: e.target.value})}/>
                 </div>
               </div>
               <div className="input-group mt-3">
                  <label>Descripción</label>
                  <textarea rows="3" value={formProd.descripcion} onChange={e=>setFormProd({...formProd, descripcion: e.target.value})}/>
               </div>
               <div className="mt-4 d-flex gap-2">
                 <button type="submit" className="btn-crear">Guardar en BD</button>
                 <button type="button" className="btn-action" onClick={()=>setVista('productos')}>Cancelar</button>
               </div>
             </form>
          </div>
        );

      case 'usuarios':
        return (
            <div className="admin-card">
              <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3>👥 Gestión de Usuarios (Local)</h3>
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

      case 'nuevo_user':
         // (Este bloque queda igual que tu original para usuarios)
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

      case 'ayuda':
        return (
            <div className="admin-card">
                <h3>🆘 Centro de Ayuda</h3>
                <p className="mb-4 text-muted">Contacta al equipo de soporte técnico.</p>
                {/* Tu contenido de ayuda sigue igual */}
            </div>
        );

      default: return null;
    }
  };

  return (
    <div className="admin-layout">
        {/* SIDEBAR */}
        <aside className="admin-sidebar">
            <div className="admin-logo">¡Umai! Admin 🧁</div>
            
            <div className="nav-section">
                <p className="nav-label">Gestión</p>
                <button className={`nav-btn ${vista === 'productos' || vista === 'nuevo_prod' ? 'active' : ''}`} onClick={()=>setVista('productos')}>📦 Productos</button>
                <button className={`nav-btn ${vista === 'usuarios' || vista === 'nuevo_user' ? 'active' : ''}`} onClick={()=>setVista('usuarios')}>👥 Usuarios</button>
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