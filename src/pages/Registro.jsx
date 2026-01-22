import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';

const Registro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    edad: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistro = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden ❌");
      return;
    }
    if (formData.edad < 18) {
      setError("Debes ser mayor de edad para registrarte 🔞");
      return;
    }

    const usuarioNuevo = {
      nombre: formData.nombre,
      email: formData.email,
      password: formData.password
    };

    localStorage.setItem('usuario_registrado', JSON.stringify(usuarioNuevo));

    alert("¡Cuenta creada con éxito! Ahora inicia sesión 🍰");
    navigate('/login');
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div style={{ fontSize: '3rem' }}>🍰</div>
        <h2>Crea tu cuenta</h2>
        
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleRegistro}>
          <div className="input-group">
            <label>Nombre Completo</label>
            <input type="text" name="nombre" required placeholder="Tu nombre..." onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Correo Electrónico</label>
            <input type="email" name="email" required placeholder="ejemplo@correo.com" onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Edad</label>
            <input type="number" name="edad" required placeholder="Tu edad" onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input type="password" name="password" required placeholder="Mínimo 8 caracteres" onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Confirmar Contraseña</label>
            <input type="password" name="confirmPassword" required placeholder="Repite la contraseña" onChange={handleChange} />
          </div>

          <button type="submit" className="btn-login">Registrarme 🥐</button>
        </form>

        <div className="link-registro">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </div>
      </div>
    </div>
  );
};

export default Registro;