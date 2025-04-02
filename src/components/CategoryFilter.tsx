
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Filter, Leaf, FileText, Wine, Inbox, Hammer, Heartbeat, AlertTriangle } from 'lucide-react';
import { WasteCategory } from '../types';

interface CategoryFilterProps {
  selectedCategories: WasteCategory[];
  onCategoryToggle: (category: WasteCategory) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategories, onCategoryToggle }) => {
  const categories: { value: WasteCategory; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'organic', label: 'Orgánico', icon: <Leaf size={16} />, color: 'bg-waste-organic' },
    { value: 'paper', label: 'Papel', icon: <FileText size={16} />, color: 'bg-waste-paper text-black' },
    { value: 'glass', label: 'Vidrio', icon: <Wine size={16} />, color: 'bg-waste-glass' },
    { value: 'plastic', label: 'Plástico', icon: <Inbox size={16} />, color: 'bg-waste-plastic' },
    { value: 'metal', label: 'Metal', icon: <Hammer size={16} />, color: 'bg-waste-metal' },
    { value: 'sanitary', label: 'Control Sanitario', icon: <Heartbeat size={16} />, color: 'bg-waste-sanitary' },
    { value: 'dump', label: 'Basurales', icon: <AlertTriangle size={16} />, color: 'bg-waste-dump' },
    { value: 'various', label: 'Varios', icon: <Trash2 size={16} />, color: 'bg-waste-various' },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <Filter size={18} className="mr-2" />
        <h2 className="text-lg font-medium">Filtrar por categoría</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant="outline"
            size="sm"
            className={`flex items-center ${
              selectedCategories.includes(category.value)
                ? `${category.color} text-white border-transparent`
                : 'bg-white hover:bg-gray-100'
            }`}
            onClick={() => onCategoryToggle(category.value)}
          >
            {category.icon}
            <span className="ml-1">{category.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
