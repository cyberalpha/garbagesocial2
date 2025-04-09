
import React from 'react';
import { Calendar, MapPin, User } from 'lucide-react';

interface PostMetadataProps {
  username: string;
  createdAt: string;
  address: string;
  distanceToPost: number | null;
}

const PostMetadata: React.FC<PostMetadataProps> = ({
  username,
  createdAt,
  address,
  distanceToPost
}) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center text-muted-foreground">
        <User className="h-4 w-4 mr-2" />
        <span>Publicado por {username}</span>
      </div>
      
      <div className="flex items-center text-muted-foreground">
        <Calendar className="h-4 w-4 mr-2" />
        <span>Publicado el {formatDate(createdAt)}</span>
      </div>
      
      <div className="flex items-center text-muted-foreground">
        <MapPin className="h-4 w-4 mr-2" />
        <span>{address}</span>
      </div>
      
      {distanceToPost !== null && (
        <div className="text-muted-foreground">
          <span>Distancia: {(distanceToPost / 1000).toFixed(2)} km</span>
          {distanceToPost < 100 && (
            <span className="ml-2 text-green-600 font-medium">¡Estás cerca!</span>
          )}
        </div>
      )}
    </div>
  );
};

export default PostMetadata;
