
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
            <span className="text-xl font-bold">Garbage Social</span>
          </div>
          <p className="text-white/80 mb-4">
            Conectamos residuos con Recicladores.
          </p>
          <div className="flex space-x-4">
            <a href="https://x.com/garbagesocial/" aria-label="Twitter" className="text-white/80 hover:text-white">
              <Twitter size={20} />
            </a>
            <a href="https://www.facebook.com/GarbageSocial/" aria-label="Facebook" className="text-white/80 hover:text-white">
              <Facebook size={20} />
            </a>
            <a href="https://www.instagram.com/garbagesocial/" aria-label="Instagram" className="text-white/80 hover:text-white">
              <Instagram size={20} />
            </a>
            <a href="https://github.com/cyberalpha/garbagesocial2" aria-label="GitHub" className="text-white/80 hover:text-white">
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
              <a href="https://garbagesocial.blogspot.com/2014/05/licencias.html" className="text-white/80 hover:text-white">
                Licencias
              </a>
            </li>
            <li>
              <a href="https://garbagesocial.blogspot.com/" className="text-white/80 hover:text-white">
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
                San Vicente, Buenos Aires, Argentina
              </span>
            </li>
            <li className="flex items-start">
              <Phone size={18} className="mr-2 mt-0.5" />
              <span className="text-white/80">
                +54 9 2224 ????
              </span>
            </li>
            <li className="flex items-start">
              <Mail size={18} className="mr-2 mt-0.5" />
              <span className="text-white/80">
                socialgarbage3000@gmail.com
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/80 text-sm">
            © 2025 Grabage Social. Todos los derechos reservados.
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
