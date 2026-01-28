import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css'; // Usamos los mismos estilos del Login

const Registro = () => {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');

    try {
        // Preparamos el usuario (Por defecto todos son CLIENTES)
        const nuevoUsuario = { 
            nombre: form.nombre,
            email: form.email,
            password: form.password,
            rol: 'cliente' // 👈 Importante para que no se registren como admin
        };

        // Petición al Backend
        const response = await fetch("http://localhost:8080/api/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoUsuario)
        });

        if (response.ok) {
            alert("¡Cuenta creada con éxito! 🍰 Ahora puedes iniciar sesión.");
            navigate('/login');
        } else {
            setError("Hubo un error. Puede que el correo ya esté usado.");
        }

    } catch (err) {
        console.error(err);
        setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Crear Cuenta 🍪</h2>
        
        <form onSubmit={handleRegistro}>
          
          <div className="input-group">
            <label>Nombre Completo</label>
            <input 
                type="text" 
                name="nombre"
                placeholder="Ej. Juan Pérez" 
                value={form.nombre}
                onChange={handleChange}
                required
            />
          </div>

          <div className="input-group">
            <label>Correo Electrónico</label>
            <input 
                type="email" 
                name="email"
                placeholder="nombre@ejemplo.com" 
                value={form.email}
                onChange={handleChange}
                required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input 
                type="password" 
                name="password"
                placeholder="••••••••" 
                value={form.password}
                onChange={handleChange}
                required
            />
          </div>

          {error && <div className="text-danger mb-3" style={{color: 'red'}}>{error}</div>}

          <button type="submit" className="btn-login-submit">
            Registrarme
          </button>
        </form>

        <p style={{marginTop: '20px', fontSize: '0.9rem'}}>
            ¿Ya tienes cuenta? <Link to="/login" style={{color: '#e85a9d', fontWeight: 'bold'}}>Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;