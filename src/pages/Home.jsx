import React from 'react';
import '../styles/home.css';

const Home = () => {
  return (
    <section className="hero">
      <div className="hero-img">
        <img src="/img/imagenTch.png" alt="Pastel de chocolate" />
      </div>

      <aside className="hero-text">
        <h1 className="TituloIMG">¡Umai!</h1>
        <div className="pIMG">
          <p>
            En Pastelería ¡Umai! creemos que los mejores momentos se celebran con algo dulce.
            <br />Nacimos con la idea de unir lo artesanal con lo moderno:
            <br />recetas cuidadas, ingredientes seleccionados y ese detalle que se nota en cada bocado
          </p>
          <p>
            Cada pastel, tartaleta o postre se prepara con cariño y dedicación, buscando que tu
            “frase favorita” sea siempre la misma: ¡qué rico!
          </p>
          <p>
            Bienvenido/a a un lugar donde el chocolate, la crema y los sabores únicos hacen que quieras
            volver una y otra vez.
          </p>
        </div>
      </aside>
    </section>
  );
};

export default Home;