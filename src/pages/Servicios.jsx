import React from 'react';
import '../styles/home.css';      
import '../styles/servicios.css'; 

const Servicios = () => {
  return (
    <div className="fade-in-container" style={{ minHeight: "100vh", position: "relative" }}>
  
      <div className="banda-lateral banda-izquierda"></div>
      <div className="banda-lateral banda-derecha"></div>

      <div className="servicios-container container">
        
        <div className="header-servicios text-center mb-5">
          <h1 className="TituloIMG" style={{ color: "#4e342e", fontSize: "3.5rem" }}>
            Nuestros Servicios
          </h1>
          <p className="text-cacao" style={{ fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto" }}>
            En <strong>Pastelería ¡Umai!</strong> nos dedicamos a endulzar tus momentos 
            más importantes.
          </p>
        </div>

        <div className="row g-4 justify-content-center">

          <div className="col-12 col-md-6 col-lg-4">
            <div className="card-servicio h-100">
              <span className="icon-servicio">☕</span>
              <h4>Catering Corporativo</h4>
              <p className="text-muted">
                Servicio completo de coffe break para empresas. 
                Incluye variedad de mini pasteles y café de grano.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="card-servicio h-100">
              <span className="icon-servicio">🍬</span>
              <h4>Mesas Dulces</h4>
              <p className="text-muted">
                Variedad de postres en formato mini diseñados para decorar 
                y endulzar tus eventos sociales.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="card-servicio h-100">
              <span className="icon-servicio">🎁</span>
              <h4>Regalos y Boxes</h4>
              <p className="text-muted">
                Sorprende a alguien especial con nuestras cajas de regalo 
                personalizadas y empaque único.
              </p>
            </div>
          </div>
}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card-servicio h-100">
              <span className="icon-servicio">🎂</span>
              <h4>Tortas de Autor</h4>
              <p className="text-muted">
                Diseños personalizados para bodas y aniversarios, 
                fusionando tus ideas con nuestra técnica.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="card-servicio h-100">
              <span className="icon-servicio">🍫</span>
              <h4>Suscripción ¡Umai!</h4>
              <p className="text-muted">
                Recibe mensualmente una selección sorpresa de nuestros 
                nuevos lanzamientos en tu puerta.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Servicios;