
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, CheckCircle } from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import { Post } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { 
    addSuffix: true,
    locale: es 
  });

  const statusBadge = () => {
    switch (post.status) {
      case 'available':
        return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded">Disponible</span>;
      case 'claimed':
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-0.5 rounded">Reclamado</span>;
      case 'collected':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded">Recolectado</span>;
      default:
        return null;
    }
  };

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {post.imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <img 
                src={post.userAvatar || "https://i.pravatar.cc/150?img=66"} 
                alt={post.username}
              />
            </Avatar>
            <span className="font-medium text-sm">{post.username}</span>
          </div>
          <CategoryBadge category={post.category} />
        </div>
        <Link to={`/post/${post.id}`}>
          <h3 className="mt-2 text-lg font-semibold hover:text-primary transition-colors duration-200">{post.title}</h3>
        </Link>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
        <div className="mt-4 flex items-center text-xs text-muted-foreground">
          <MapPin size={14} className="mr-1" />
          <span className="truncate">{post.location.address}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar size={14} className="mr-1" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center space-x-2">
          {statusBadge()}
          <Link to={`/post/${post.id}`}>
            <Button variant="outline" size="sm">Ver Detalles</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
