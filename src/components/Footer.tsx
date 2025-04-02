
import React from 'react';
import { Link } from 'react-router-dom';
import { RecycleIcon, Mail, Phone, MapPin, Github, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-cyan-600 to-green-600 text-white">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <RecycleIcon className="h-6 w-6" />
            <span className="text-xl font-bold">EcoResiduos</span>
          </div>
          <p className="text-white/80 mb-4">
            Conectando personas que tienen desechos con quienes pueden reciclarlos y darles una segunda vida.
          </p>
          <div className="flex space-x-4">
            <a href="https://twitter.com" aria-label="Twitter" className="text-white/80 hover:text-white">
              <Twitter size={20} />
            </a>
            <a href="https://facebook.com" aria-label="Facebook" className="text-white/80 hover:text-white">
              <Facebook size={20} />
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="text-white/80 hover:text-white">
              <Instagram size={20} />
            </a>
            <a href="https://github.com" aria-label="GitHub" className="text-white/80 hover:text-white">
              <Github size={20} />
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-4">Navegación</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-white/80 hover:text-white">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-white/80 hover:text-white">
                Acerca de
              </Link>
            </li>
            <li>
              <Link to="/map" className="text-white/80 hover:text-white">
                Mapa de residuos
              </Link>
            </li>
            <li>
              <Link to="/new-post" className="text-white/80 hover:text-white">
                Publicar residuo
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Recursos</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-white/80 hover:text-white">
                Guía de reciclaje
              </a>
            </li>
            <li>
              <a href="#" className="text-white/80 hover:text-white">
                Tipos de residuos
              </a>
            </li>
            <li>
              <a href="#" className="text-white/80 hover:text-white">
                Puntos de acopio
              </a>
            </li>
            <li>
              <a href="#" className="text-white/80 hover:text-white">
                Blog
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Contacto</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <MapPin size={18} className="mr-2 mt-0.5" />
              <span className="text-white/80">
                Santiago, Chile
              </span>
            </li>
            <li className="flex items-start">
              <Phone size={18} className="mr-2 mt-0.5" />
              <span className="text-white/80">
                +56 2 2123 4567
              </span>
            </li>
            <li className="flex items-start">
              <Mail size={18} className="mr-2 mt-0.5" />
              <span className="text-white/80">
                info@ecoresiduos.cl
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/80 text-sm">
            © 2024 EcoResiduos. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-white/80 hover:text-white">
              Términos de Uso
            </a>
            <a href="#" className="text-sm text-white/80 hover:text-white">
              Política de Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
