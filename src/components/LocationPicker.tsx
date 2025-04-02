
import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationPickerProps {
  value: { lat: number; lng: number } | null;
  onChange: (location: { lat: number; lng: number }) => void;
}

// Añadimos estas declaraciones de tipo para Google Maps API
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any | null>(null);
  const [marker, setMarker] = useState<any | null>(null);
  const [loaded, setLoaded] = useState(false);
  
  // Inicializar el mapa cuando se carga el script
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return;
      
      // Coordenadas iniciales (Santiago de Chile como default)
      const defaultLocation = { lat: -33.4489, lng: -70.6693 };
      const initialLocation = value || defaultLocation;
      
      // Crear el mapa
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: 14,
        center: initialLocation,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      
      // Crear el marcador
      const markerInstance = new window.google.maps.Marker({
        position: initialLocation,
        map: mapInstance,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
      });
      
      // Manejar eventos del marcador
      window.google.maps.event.addListener(markerInstance, 'dragend', (event: any) => {
        const position = markerInstance.getPosition();
        if (position) {
          onChange({ 
            lat: position.lat(), 
            lng: position.lng()
          });
        }
      });
      
      // Manejar clicks en el mapa
      window.google.maps.event.addListener(mapInstance, 'click', (event: any) => {
        const clickedLocation = { 
          lat: event.latLng.lat(), 
          lng: event.latLng.lng()
        };
        markerInstance.setPosition(clickedLocation);
        onChange(clickedLocation);
      });
      
      // Si el usuario lo permite, utilizar su ubicación actual
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            mapInstance.setCenter(userLocation);
            markerInstance.setPosition(userLocation);
            onChange(userLocation);
          },
          () => {
            // Si hay error o el usuario no da permiso, usamos la ubicación por defecto
            console.log("No se pudo acceder a la ubicación del usuario");
          }
        );
      }
      
      setMap(mapInstance);
      setMarker(markerInstance);
      setLoaded(true);
    };

    // Si ya existe el objeto google en window, inicializamos el mapa
    if (window.google && window.google.maps) {
      initMap();
      return;
    }
    
    // De lo contrario, cargamos el script de Google Maps
    window.initMap = initMap;
    
    const script = document.createElement('script');
    // Actualizada la API key proporcionada
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDw-oZruoaJzPckh5ZE2wpJBblpWSuYdUQ&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    return () => {
      window.initMap = () => {};
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Actualizar el marcador cuando cambia el valor
  useEffect(() => {
    if (marker && map && value) {
      marker.setPosition(value);
      map.setCenter(value);
    }
  }, [value, marker, map]);

  return (
    <div className="w-full">
      <div 
        ref={mapRef} 
        className="w-full h-[300px] rounded-md border overflow-hidden"
      ></div>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      <div className="mt-2 flex items-center text-sm text-muted-foreground">
        <MapPin className="mr-1 h-4 w-4" />
        <span>
          {value 
            ? `Ubicación seleccionada (${value.lat.toFixed(6)}, ${value.lng.toFixed(6)})` 
            : 'Haz clic en el mapa para seleccionar la ubicación'}
        </span>
      </div>
    </div>
  );
};

export default LocationPicker;
