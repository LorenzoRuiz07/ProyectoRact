import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css'; 

const Login = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
        // 1. Petición al Backend para buscar el usuario
        const response = await fetch("http://localhost:8080/api/usuarios/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        // Verificamos si la respuesta del servidor fue exitosa (status 200)
        if (!response.ok) {
            throw new Error("Credenciales inválidas");
        }

        const data = await response.json();

        // 2. Verificamos si el usuario existe (tiene ID)
        if (data && data.id) {
            // LIMPIEZA: Borramos cualquier rastro antiguo o banderas viejas
            localStorage.removeItem('isAdmin'); 
            
            // GUARDAMOS EL USUARIO COMPLETO EN LOCALSTORAGE
            localStorage.setItem("usuario", JSON.stringify(data));
            
            // 3. Redirección según rol
            if (data.rol === 'admin') {
                alert(`¡Bienvenido Admin ${data.nombre}! 🛡️`);
                navigate('/admin');
            } else {
                alert(`¡Hola ${data.nombre}! 🍪 Que disfrutes tus pasteles.`);
                navigate('/');
            }
        } else {
            setError("Correo o contraseña incorrectos");
        }

    } catch (err) {
        console.error(err);
        // Mensaje amigable si falla la conexión o las credenciales
        setError("Usuario no encontrado o contraseña incorrecta.");
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

          {error && <div className="text-danger mb-3" style={{color: 'red', fontWeight: 'bold'}}>{error}</div>}

          <button type="submit" className="btn-login-submit" style={{
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
            ¿No tienes cuenta? <Link to="/registro" style={{color: '#e85a9d', fontWeight: 'bold'}}>Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;