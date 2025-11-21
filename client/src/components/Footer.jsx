import '../assets/css/Footer.css';

export default function Footer() {
  return (
    <footer className="Footer">
      <div className='TituloFooter'>
      <h1>ALMACÉN DE PIZZAS</h1>
      </div>
      <h3>Contactanos en nuestras redes sociales:</h3>
      <div className='footer-redes'>
      <a href="https://www.facebook.com/AlmacenDePizzasARG"> <i className="fa-brands fa-facebook-f"></i></a>
      <a href=" https://www.instagram.com/accounts/login/?next=%2Falmacendepizzas%2F&source=omni_redirect"><i className="fa-brands fa-instagram"> </i>
    </a>
      <a href="https://twitter.com/AlmacenPizzas"><i className="fa-brands fa-twitter"></i></a>
      <p>© 2024 Almacén de Pizzas. Todos los derechos reservados.</p>
      <a href="">Terminos y Condiciones.</a></div>
    </footer>
  );
}