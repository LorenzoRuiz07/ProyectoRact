import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css'; 

const Login = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === 'admin@umai.com' && password === 'admin123') {
        
        localStorage.setItem('isAdmin', 'true'); 
        
        alert("¡Bienvenido Admin! 🧁");
        navigate('/admin'); 
    } 
   
    else if (email.length > 0 && password.length > 0) {
        localStorage.removeItem('isAdmin'); 
        alert("¡Bienvenido cliente! 🍪");
        navigate('/'); 
    } 

    else {
        setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Iniciar Sesión 🧁</h2>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Correo Electrónico</label>
            <input 
                type="email" 
                placeholder="nombre@ejemplo.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>

          {error && <div style={{color: 'red', marginBottom: '15px'}}>{error}</div>}

          <button type="submit" style={{
              width: '100%', 
              padding: '12px', 
              background: '#e85a9d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '25px', 
              fontWeight: 'bold',
              cursor: 'pointer'
          }}>
            Ingresar
          </button>
        </form>

        <p style={{marginTop: '20px', fontSize: '0.9rem'}}>
            ¿No tienes cuenta? <a href="/registro" style={{color: 'skyblue'}}>Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

export default Login;