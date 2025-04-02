
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Recycle, MapPin, UserCircle, Plus } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-primary text-primary-foreground border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Recycle size={24} />
              <span className="font-bold text-xl">Garbage Social</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground hover:text-primary transition duration-150">
                  Inicio
                </Link>
                <Link to="/map" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground hover:text-primary transition duration-150">
                  Mapa
                </Link>
                <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground hover:text-primary transition duration-150">
                  Acerca de
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link to="/new-post">
              <Button variant="outline" size="sm" className="bg-white text-primary hover:bg-gray-100">
                <Plus size={18} className="mr-1" />
                Publicar
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <UserCircle size={24} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="md:hidden bg-primary-foreground text-primary">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100">
            Inicio
          </Link>
          <Link to="/map" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100">
            <div className="flex items-center">
              <MapPin size={18} className="mr-2" />
              Mapa
            </div>
          </Link>
          <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100">
            Acerca de
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
