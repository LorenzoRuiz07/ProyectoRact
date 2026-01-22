import React from 'react';
import '../styles/home.css';      // Estilos base
import '../styles/proyectos.css'; // Estilos específicos de esta página

const Proyectos = () => {
  return (
    <div className="fade-in-container" style={{ minHeight: "100vh", position: "relative", paddingBottom: "50px" }}>
      
      {/* 1. BANDAS LATERALES (Chocolate) */}
      <div className="banda-lateral banda-izquierda"></div>
      <div className="banda-lateral banda-derecha"></div>

      {/* 2. CONTENIDO PRINCIPAL */}
      {/* Usamos 'container' de Bootstrap y un estilo inline para que no choque con las bandas */}
      <div className="container" style={{ maxWidth: "85%", position: "relative", zIndex: 1, paddingTop: "40px" }}>
        
        {/* ENCABEZADO */}
        <div className="text-center header-proyectos">
            <h1 className="TituloIMG" style={{ color: "#4e342e", fontSize: "3.5rem" }}>
                Proyectos 2026
            </h1>
            <p className="text-cacao" style={{ fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto" }}>
                En <strong>Pastelería ¡Umai!</strong> nunca dejamos de soñar. 
                Aquí te contamos lo que se viene cocinando en nuestro horno de ideas.
            </p>
        </div>

        {/* 3. GRILLA DE PROYECTOS (Layout 2x2) */}
        <div className="row g-4 mt-4">
            
            {/* Proyecto 1: Expansión */}
            <div className="col-12 col-md-6">
                <div className="card-proyecto h-100">
                    <span className="fecha-proyecto">Marzo 2025</span>
                    <span className="icon-proyecto">🏪</span>
                    <h4 className="fw-bold text-cacao">Expansión Local Centro</h4>
                    <p className="text-muted">
                        Inauguraremos nuestra segunda sucursal con un concepto de 
                        "Cafetería Abierta", donde podrás ver a nuestros maestros pasteleros en acción.
                    </p>
                </div>
            </div>

            {/* Proyecto 2: Línea Saludable */}
            <div className="col-12 col-md-6">
                <div className="card-proyecto h-100">
                    <span className="fecha-proyecto">Junio 2025</span>
                    <span className="icon-proyecto">🌱</span>
                    <h4 className="fw-bold text-cacao">Línea "Umai Vital"</h4>
                    <p className="text-muted">
                        Lanzamiento oficial de nuestra línea certificada 100% Keto y Sin Gluten, 
                        usando harinas alternativas y endulzantes naturales.
                    </p>
                </div>
            </div>

            {/* Proyecto 3: Talleres */}
            <div className="col-12 col-md-6">
                <div className="card-proyecto h-100">
                    <span className="fecha-proyecto">Septiembre 2026</span>
                    <span className="icon-proyecto">👩‍🍳</span>
                    <h4 className="fw-bold text-cacao">Talleres "Maestro Pastelero"</h4>
                    <p className="text-muted">
                        Abriremos nuestra cocina para clases presenciales. 
                        Aprenderás desde el templado de chocolate hasta el secreto de nuestros macarons.
                    </p>
                </div>
            </div>

            {/* Proyecto 4: App Delivery */}
            <div className="col-12 col-md-6">
                <div className="card-proyecto h-100">
                    <span className="fecha-proyecto">Diciembre 2026</span>
                    <span className="icon-proyecto">📱</span>
                    <h4 className="fw-bold text-cacao">App ¡Umai! Delivery</h4>
                    <p className="text-muted">
                        Presentaremos nuestra aplicación oficial para pedidos personalizados, 
                        donde podrás diseñar tu propia torta y seguir el proceso en tiempo real.
                    </p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Proyectos;