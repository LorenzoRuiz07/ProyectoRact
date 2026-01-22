import React from 'react';
import '../styles/home.css';      // Estilos base
import '../styles/nosotros.css';  // Estilos específicos

const Nosotros = () => {
  return (
    <div className="fade-in-container position-relative" style={{ minHeight: "100vh", paddingBottom: "50px" }}>
      
      {/* 1. BANDAS LATERALES */}
      <div className="banda-lateral banda-izquierda"></div>
      <div className="banda-lateral banda-derecha"></div>

      {/* 2. CONTENIDO PRINCIPAL */}
      <div className="container seccion-historia-container" style={{ paddingTop: "50px" }}>
        
        {/* Título */}
        <div className="text-center">
            <h1 className="titulo-historia">Nuestra Historia</h1>
        </div>

        {/* Sección de Texto Destacado */}
        <div className="destacado">
            <p>
                Todo comenzó en el verano de 2010, en la pequeña cocina de la abuela Rosa. 
                Lo que inició como un pasatiempo de fin de semana, horneando galletas para 
                los vecinos, pronto se transformó en una pasión incontrolable por el arte 
                de la pastelería.
            </p>
            <p>
                En <strong>Pastelería ¡Umai!</strong>, creemos que un postre no es solo azúcar y harina. 
                Es un momento de pausa, una celebración, un "te quiero" o simplemente un abrazo comestible 
                después de un largo día.
            </p>
            <p>
                Hoy, diez años después, seguimos horneando con el mismo amor del primer día, 
                pero con la técnica de los grandes maestros pasteleros.
            </p>
        </div>

        {/* Sección de Valores */}
        <div className="text-center mb-5">
            <h2 style={{ fontFamily: "'Pacifico', cursive", fontSize: "3rem", color: "#4e342e" }}>
                Nuestros Valores
            </h2>
        </div>

        <div className="row g-4 justify-content-center">
            
            {/* Valor 1 */}
            <div className="col-12 col-md-4">
                <div className="card-valor">
                    <span className="emoji-valor">🥚</span>
                    <h4 className="fw-bold text-cacao">Calidad Real</h4>
                    <p className="text-muted mt-3">
                        Priorizamos insumos frescos y de origen local, asegurando que 
                        cada ingrediente cumpla con nuestros estándares de excelencia.
                    </p>
                </div>
            </div>

            {/* Valor 2 */}
            <div className="col-12 col-md-4">
                <div className="card-valor">
                    <span className="emoji-valor">❤️</span>
                    <h4 className="fw-bold text-cacao">Hecho a Mano</h4>
                    <p className="text-muted mt-3">
                        Preservamos el valor de lo artesanal, dedicando el tiempo necesario 
                        a cada proceso de batido y decoración personalizada.
                    </p>
                </div>
            </div>

            {/* Valor 3 */}
            <div className="col-12 col-md-4">
                <div className="card-valor">
                    <span className="emoji-valor">🌱</span>
                    <h4 className="fw-bold text-cacao">Sostenibilidad</h4>
                    <p className="text-muted mt-3">
                        Mantenemos un compromiso activo con el medio ambiente a través 
                        de procesos responsables y empaques de bajo impacto.
                    </p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Nosotros;