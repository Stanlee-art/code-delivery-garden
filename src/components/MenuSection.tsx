
import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MenuItemType } from '@/types/menu';
import { useOrder } from '@/contexts/OrderContext';
import { translations } from '@/utils/translations';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  const { addToOrder, language } = useOrder();
  
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
      <h2 className="text-2xl font-semibold mb-4 pb-2 border-b" id={`${title.toLowerCase()}Heading`}>{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="menu-item overflow-hidden bg-white rounded-md shadow"
          >
            {item.image && (
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            <CardContent className="p-4 flex flex-col h-[calc(100%-12rem)]">
              <h3 className="text-lg font-medium mb-1">{item.name}</h3>
              <p className="text-[#684b2c] dark:text-[#ffcc00] font-bold mb-2">${item.price}</p>
              {item.description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{item.description}</p>
              )}
              
              <div className="mt-auto">
                {/* Rating stars */}
                <div className="rating mb-2" data-item-id={item.id}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <span
                      key={value}
                      data-value={value}
                      onClick={() => onRatingClick(item.id, value)}
                      className="text-2xl cursor-pointer"
                      style={{ 
                        color: value <= (selectedRatings[item.id] || 0) ? '#ffcc00' : '#ccc' 
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                
                {/* Add to Order button */}
                <Button 
                  className="w-full bg-[#684b2c] hover:bg-[#a77e58] text-white py-2 rounded"
                  onClick={() => addToOrder(item)}
                >
                  {translations[language].orderNow}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
