
import React, { useEffect } from 'react';
import $ from 'jquery';

const JQueryExample: React.FC = () => {
  useEffect(() => {
    // Ejemplo básico de uso de jQuery
    $('.jquery-example').fadeIn('slow');
    
    // También puedes usar otras funcionalidades de jQuery
    $(document).ready(function() {
      console.log('Documento listo usando jQuery!');
    });
    
    // Limpiar efectos cuando el componente se desmonta
    return () => {
      $('.jquery-example').off();
    };
  }, []);

  return (
    <div className="jquery-example p-4 bg-slate-100 rounded-md hidden">
      <h2 className="text-xl font-bold mb-2">Ejemplo de jQuery</h2>
      <p>Este elemento apareció con un efecto fade usando jQuery.</p>
    </div>
  );
};

export default JQueryExample;
