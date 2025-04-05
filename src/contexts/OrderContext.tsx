
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MenuItemType } from '@/types/menu';
import { toast } from '@/hooks/use-toast';
import { translations, SupportedLanguage } from '@/utils/translations';

interface OrderItem extends MenuItemType {
  quantity: number;
}

interface OrderContextType {
  orderItems: OrderItem[];
  addToOrder: (item: MenuItemType) => void;
  removeFromOrder: (itemId: string) => void;
  increaseQuantity: (itemId: string) => void;
  decreaseQuantity: (itemId: string) => void;
  clearOrder: () => void;
  totalItems: number;
  totalPrice: number;
  showOrderSummary: boolean;
  setShowOrderSummary: (show: boolean) => void;
  language: SupportedLanguage;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children, language }: { children: ReactNode, language: SupportedLanguage }) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const addToOrder = (item: MenuItemType) => {
    setOrderItems(prevItems => {
      const existingItem = prevItems.find(orderItem => orderItem.id === item.id);
      
      if (existingItem) {
        return prevItems.map(orderItem => 
          orderItem.id === item.id 
            ? { ...orderItem, quantity: orderItem.quantity + 1 } 
            : orderItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    
    toast({
      title: translations[language].itemAdded,
      description: `${item.name} ${translations[language].addedToOrder}`,
      duration: 2000,
    });
  };

  const removeFromOrder = (itemId: string) => {
    setOrderItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const increaseQuantity = (itemId: string) => {
    setOrderItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      )
    );
  };

  const decreaseQuantity = (itemId: string) => {
    setOrderItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const clearOrder = () => {
    setOrderItems([]);
  };

  // Calculate total items and price
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = orderItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity, 
    0
  );

  return (
    <OrderContext.Provider value={{
      orderItems,
      addToOrder,
      removeFromOrder,
      increaseQuantity,
      decreaseQuantity,
      clearOrder,
      totalItems,
      totalPrice,
      showOrderSummary,
      setShowOrderSummary,
      language
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
