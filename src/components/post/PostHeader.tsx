
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CategoryBadge from '@/components/CategoryBadge';
import { Edit } from 'lucide-react';
import { WasteCategory } from '@/types';

interface PostHeaderProps {
  title: string;
  category: WasteCategory;
  canEditPost: boolean;
  onEdit: () => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  title,
  category,
  canEditPost,
  onEdit
}) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <div className="mt-2">
          <CategoryBadge category={category} />
        </div>
      </div>
      
      {canEditPost && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onEdit}
        >
          <Edit className="h-4 w-4 mr-1" />
          Editar
        </Button>
      )}
    </div>
  );
};

export default PostHeader;
