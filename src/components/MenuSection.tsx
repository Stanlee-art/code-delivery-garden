
import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MenuItemType } from '@/types/menu';

interface MenuSectionProps {
  title: string;
  items: MenuItemType[];
  searchQuery: string;
  onRatingClick: (itemId: string, value: number) => void;
  selectedRatings: Record<string, number>;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  title,
  items,
  searchQuery,
  onRatingClick,
  selectedRatings
}) => {
  // Filter items based on search query
  const filteredItems = searchQuery 
    ? items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;
    
  if (filteredItems.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4 border-b pb-2">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            {item.image && (
              <div className="relative w-full h-48">
                <AspectRatio ratio={4/3} className="bg-muted">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium">{item.name}</h3>
                <span className="text-lg font-bold">${item.price}</span>
              </div>
              {item.description && (
                <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
              )}
              
              {/* Rating stars */}
              <div className="flex space-x-1 mt-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => onRatingClick(item.id, value)}
                    className="text-2xl focus:outline-none"
                  >
                    <span 
                      className={value <= (selectedRatings[item.id] || 0) 
                        ? "text-yellow-400" 
                        : "text-gray-300"}
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
