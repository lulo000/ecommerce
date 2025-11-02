import '../assets/css/Footer.css';

export default function Footer() {
  return (
    <footer className="Footer">
      <div className='TituloFooter'>
      <h1>ALMACEN DE PIZZAS</h1>
      </div>
      <p><h2>Contactanos en nuestras redes sociales:</h2></p>
      <div className='footer-redes'>
      <a href="https://www.facebook.com/AlmacenDePizzasARG"> <i class="fa-brands fa-facebook-f"></i></a>
      <a href=" https://www.instagram.com/accounts/login/?next=%2Falmacendepizzas%2F&source=omni_redirect"><i class="fa-brands fa-instagram"> </i>
    </a>
      <a href="https://twitter.com/AlmacenPizzas"><i class="fa-brands fa-twitter"></i></a>
      <p>© 2024 Almacén de Pizzas. Todos los derechos reservados.</p>
      <a href="">Terminos y Condiciones.</a></div>
    </footer>
  );
}