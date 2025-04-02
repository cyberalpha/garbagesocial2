
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { MapPin, Calendar } from 'lucide-react';

interface PostsListProps {
  posts: Post[];
  loading: boolean;
  selectedPosts: Post[];
  onPostSelect: (post: Post) => void;
}

const PostsList: React.FC<PostsListProps> = ({ posts, loading, selectedPosts, onPostSelect }) => {
  const getCategoryName = (category: string): string => {
    const categories: Record<string, string> = {
      'organic': 'Orgánico',
      'paper': 'Papel',
      'glass': 'Vidrio',
      'plastic': 'Plástico',
      'metal': 'Metal',
      'sanitary': 'Sanitario',
      'dump': 'Basural',
      'various': 'Varios'
    };
    
    return categories[category] || 'Desconocido';
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay residuos disponibles para mostrar
      </div>
    );
  }
  
  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
      {posts.map(post => {
        const isSelected = selectedPosts.some(p => p.id === post.id);
        const formattedDate = formatDistanceToNow(new Date(post.createdAt), { 
          addSuffix: true,
          locale: es 
        });
        
        return (
          <div 
            key={post.id} 
            className={`p-4 border rounded-lg transition-all ${
              isSelected ? 'bg-green-50 border-green-300' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <Checkbox 
                checked={isSelected} 
                onCheckedChange={() => onPostSelect(post)}
                className="mt-1"
              />
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-md line-clamp-1">{post.title}</h3>
                  <Badge variant="outline" className="ml-2">
                    {getCategoryName(post.category)}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {post.description}
                </div>
                
                <div className="flex flex-col gap-1 text-xs text-gray-500">
                  <div className="flex items-center">
                    <MapPin size={12} className="mr-1" />
                    <span className="line-clamp-1">{post.location.address}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostsList;
