
import React, { useEffect, useState } from 'react';

const JQueryExample: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Simulamos el efecto fadeIn con un pequeño retraso
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    console.log('Documento listo usando React!');
    
    // Limpieza cuando el componente se desmonta
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div 
      className={`p-4 bg-slate-100 rounded-md transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <h2 className="text-xl font-bold mb-2">Ejemplo de React</h2>
      <p>Este elemento apareció con un efecto fade usando React y CSS.</p>
    </div>
  );
};

export default JQueryExample;
