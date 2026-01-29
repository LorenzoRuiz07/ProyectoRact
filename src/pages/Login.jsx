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

        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error("Credenciales inválidas");
        }


        const data = await response.json();
        const { token, usuario } = data; 

        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify(usuario));
        
        if (usuario.rol === 'admin') {
            navigate('/admin');
        } else {
            navigate('/');
        }

    } catch (err) {
        console.error(err);
        setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-container">
        <div className="login-box">
            <h2 className="login-title">Bienvenido a Umai 🍰</h2>
            <p>Ingresa tus datos para comprar</p>
            
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