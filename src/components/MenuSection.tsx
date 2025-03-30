
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
      <h2 className="text-2xl font-semibold mb-4 border-b pb-2" id={`${title.toLowerCase()}Heading`}>{title}</h2>
      <div className="menu-items">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="menu-item"
          >
            {item.image && (
              <img 
                src={item.image} 
                alt={item.name}
              />
            )}
            <p>{item.name}</p>
            <span>${item.price}</span>
            {item.description && (
              <p className="description">{item.description}</p>
            )}
            
            {/* Rating stars */}
            <div className={`rating ${selectedRatings[item.id] ? 'selected' : ''}`} data-item-id={item.id}>
              {[1, 2, 3, 4, 5].map((value) => (
                <span
                  key={value}
                  data-value={value}
                  onClick={() => onRatingClick(item.id, value)}
                  style={{ 
                    color: value <= (selectedRatings[item.id] || 0) ? '#ffcc00' : '' 
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
