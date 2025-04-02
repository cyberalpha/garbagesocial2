
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RecycleIcon, Menu, X, LogOut, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Mapa', path: '/map' },
    { name: 'Acerca de', path: '/about' },
  ];
  
  const renderNavLinks = () => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`text-sm font-medium transition-colors hover:text-white/90 ${
            isActive(link.path) 
              ? 'text-white' 
              : 'text-white/70'
          }`}
        >
          {link.name}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-cyan-600 to-green-600 shadow-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <RecycleIcon className="h-6 w-6 text-white" />
            <span className="text-lg font-bold text-white">EcoResiduos</span>
          </Link>
          
          {!isMobile && (
            <nav className="hidden md:flex items-center gap-6 ml-6">
              {renderNavLinks()}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Button 
                variant="secondary" 
                size={isMobile ? "sm" : "default"} 
                asChild
                className="bg-white/20 text-white hover:bg-white/30 hover:text-white"
              >
                <Link to="/new-post">Publicar Residuo</Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="rounded-full h-8 w-8 p-0 overflow-hidden hover:bg-white/20"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback className="text-xs bg-white/20 text-white">
                        {profile?.name?.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button 
              variant="secondary" 
              size={isMobile ? "sm" : "default"}
              asChild
              className="bg-white/20 text-white hover:bg-white/30 hover:text-white"
            >
              <Link to="/auth">Iniciar sesión</Link>
            </Button>
          )}
          
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-gradient-to-r from-cyan-600 to-green-600 text-white border-none">
                <nav className="flex flex-col gap-4 mt-8">
                  {renderNavLinks()}
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
