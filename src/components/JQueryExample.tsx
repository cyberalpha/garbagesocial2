
import React, { useEffect, useRef } from 'react';
// Use a dynamic import approach for jQuery
const JQueryExample: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Dynamically import jQuery to avoid build issues
    const loadJQuery = async () => {
      try {
        const jquery = await import('jquery');
        const $ = jquery.default;
        
        // Once jQuery is loaded, apply effects
        if (containerRef.current) {
          $(containerRef.current).fadeIn('slow');
        }
        
        // Also use other jQuery functionalities
        $(document).ready(function() {
          console.log('Document ready using jQuery!');
        });
      } catch (error) {
        console.error("Failed to load jQuery:", error);
      }
    };
    
    loadJQuery();
    
    // Clean up effects when component unmounts
    return () => {
      // Clean up will be handled automatically by React
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="jquery-example p-4 bg-slate-100 rounded-md hidden"
    >
      <h2 className="text-xl font-bold mb-2">Ejemplo de jQuery</h2>
      <p>Este elemento apareció con un efecto fade usando jQuery.</p>
    </div>
  );
};

export default JQueryExample;
