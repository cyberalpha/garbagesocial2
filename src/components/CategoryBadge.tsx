
import React from 'react';
import { WasteCategory } from '../types';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: WasteCategory;
  className?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className }) => {
  const getCategoryStyle = () => {
    switch (category) {
      case 'organic':
        return 'bg-waste-organic';
      case 'paper':
        return 'bg-waste-paper text-black';
      case 'glass':
        return 'bg-waste-glass';
      case 'plastic':
        return 'bg-waste-plastic';
      case 'metal':
        return 'bg-waste-metal';
      case 'sanitary':
        return 'bg-waste-sanitary';
      case 'dump':
        return 'bg-waste-dump';
      case 'various':
        return 'bg-waste-various';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryName = () => {
    switch (category) {
      case 'organic':
        return 'Orgánico';
      case 'paper':
        return 'Papel';
      case 'glass':
        return 'Vidrio';
      case 'plastic':
        return 'Plástico';
      case 'metal':
        return 'Metal';
      case 'sanitary':
        return 'Control Sanitario';
      case 'dump':
        return 'Basural';
      case 'various':
        return 'Varios';
      default:
        return 'Desconocido';
    }
  };

  return (
    <span className={cn('category-badge', getCategoryStyle(), className)}>
      {getCategoryName()}
    </span>
  );
};

export default CategoryBadge;
