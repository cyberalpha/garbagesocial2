
import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";

interface MapComponentProps {
  posts: Array<{
    id: string;
    title: string;
    location: {
      lat: number;
      lng: number;
      address: string;
    };
    category: string;
  }>;
  selectedPosts: Array<any>;
  showRoute?: boolean;
  className?: string;
}

// Declaramos los tipos para Google Maps API
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  posts, 
  selectedPosts, 
  showRoute = false, 
  className 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [directionsRenderer, setDirectionsRenderer] = useState<any | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Inicializar el mapa cuando se carga el script
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return;
      
      // Santiago de Chile como ubicación por defecto
      const center = { lat: -33.4489, lng: -70.6693 };
      
      // Crear el mapa
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      });

      // Crear el directionsRenderer para las rutas
      const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#4CAF50",
          strokeWeight: 5,
          strokeOpacity: 0.7,
        }
      });
      
      directionsRendererInstance.setMap(mapInstance);
      
      setMap(mapInstance);
      setDirectionsRenderer(directionsRendererInstance);
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDw-oZruoaJzPckh5ZE2wpJBblpWSuYdUQ&callback=initMap&libraries=places,geometry`;
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

  // Actualizar marcadores cuando cambian los posts o el mapa
  useEffect(() => {
    if (!map || !loaded || posts.length === 0) return;

    // Limpiar marcadores existentes
    markers.forEach(marker => marker.setMap(null));

    // Crear nuevos marcadores
    const newMarkers = posts.map(post => {
      const isSelected = selectedPosts.some(selected => selected.id === post.id);
      
      // Personalizar icono según la categoría y selección
      const getMarkerIcon = () => {
        let color = isSelected ? '#FF5722' : '#4CAF50';
        
        // Cambiar color según categoría
        if (post.category === 'plastic') color = isSelected ? '#FF5722' : '#2196F3';
        else if (post.category === 'organic') color = isSelected ? '#FF5722' : '#8BC34A';
        else if (post.category === 'paper') color = isSelected ? '#FF5722' : '#FFC107';
        else if (post.category === 'glass') color = isSelected ? '#FF5722' : '#00BCD4';
        else if (post.category === 'metal') color = isSelected ? '#FF5722' : '#9E9E9E';
        
        return {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#FFFFFF',
          scale: isSelected ? 10 : 8
        };
      };

      // Crear el marcador
      const marker = new window.google.maps.Marker({
        position: {
          lat: post.location.lat,
          lng: post.location.lng
        },
        map,
        title: post.title,
        icon: getMarkerIcon(),
        animation: isSelected 
          ? window.google.maps.Animation.BOUNCE 
          : window.google.maps.Animation.DROP,
        zIndex: isSelected ? 2 : 1
      });

      // Info window para mostrar detalles al hacer clic
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="max-width: 200px">
            <h3 style="font-weight: bold; margin-bottom: 5px">${post.title}</h3>
            <p style="margin-bottom: 8px">${post.location.address}</p>
            <a href="/post/${post.id}" style="color: #4CAF50; text-decoration: underline">Ver detalles</a>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Ajustar el zoom para mostrar todos los marcadores
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);
      
      // Si solo hay un marcador, ajustar el zoom
      if (newMarkers.length === 1) {
        map.setZoom(15);
      }
    }
  }, [map, posts, loaded, selectedPosts]);

  // Trazar ruta cuando se solicita
  useEffect(() => {
    if (!map || !directionsRenderer || !showRoute || selectedPosts.length < 2) {
      // Si no hay ruta a mostrar, limpiar el directionsRenderer
      if (directionsRenderer) {
        directionsRenderer.setDirections({ routes: [] });
      }
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    
    // Crear un waypoints con los puntos seleccionados (excluyendo origen y destino)
    const waypoints = selectedPosts.slice(1, -1).map(post => ({
      location: new window.google.maps.LatLng(post.location.lat, post.location.lng),
      stopover: true
    }));
    
    // Configurar la ruta
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(
          selectedPosts[0].location.lat,
          selectedPosts[0].location.lng
        ),
        destination: new window.google.maps.LatLng(
          selectedPosts[selectedPosts.length - 1].location.lat,
          selectedPosts[selectedPosts.length - 1].location.lng
        ),
        waypoints,
        optimizeWaypoints: true,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (response, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
          
          // Calcular distancia y tiempo total
          let totalDistance = 0;
          let totalDuration = 0;
          
          response.routes[0].legs.forEach(leg => {
            totalDistance += leg.distance.value;
            totalDuration += leg.duration.value;
          });
          
          // Convertir a kilómetros y minutos
          const distanceKm = (totalDistance / 1000).toFixed(1);
          const durationMin = Math.round(totalDuration / 60);
          
          // Mostrar información al usuario
          console.log(`Ruta calculada: ${distanceKm} km, ${durationMin} minutos`);
        } else {
          console.error(`Error al calcular ruta: ${status}`);
        }
      }
    );
  }, [map, directionsRenderer, selectedPosts, showRoute]);

  return (
    <div className={cn("relative w-full h-[400px]", className)}>
      <div 
        ref={mapRef} 
        className="w-full h-full"
      ></div>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
