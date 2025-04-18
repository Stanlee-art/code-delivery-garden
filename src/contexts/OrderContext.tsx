
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { MenuItemType } from '@/types/menu';
import { toast } from '@/hooks/use-toast';
import { translations, SupportedLanguage } from '@/utils/translations';

export type DeliveryOption = 'delivery' | 'dine-in';

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
  deliveryOption: DeliveryOption | null;
  setDeliveryOption: (option: DeliveryOption) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Create a key for localStorage
const ORDER_STORAGE_KEY = 'coffee_shop_order_items';
const DELIVERY_OPTION_KEY = 'coffee_shop_delivery_option';

export const OrderProvider = ({ children, language }: { children: ReactNode, language: SupportedLanguage }) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption | null>(null);

  // Load saved order from localStorage on mount
  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem(ORDER_STORAGE_KEY);
      if (savedOrder) {
        setOrderItems(JSON.parse(savedOrder));
      }
      
      const savedDeliveryOption = localStorage.getItem(DELIVERY_OPTION_KEY);
      if (savedDeliveryOption) {
        setDeliveryOption(savedDeliveryOption as DeliveryOption);
      }
    } catch (error) {
      console.error('Error loading saved order:', error);
    }
  }, []);

  // Save order to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orderItems));
    } catch (error) {
      console.error('Error saving order to localStorage:', error);
    }
  }, [orderItems]);

  // Save delivery option to localStorage when it changes
  useEffect(() => {
    try {
      if (deliveryOption) {
        localStorage.setItem(DELIVERY_OPTION_KEY, deliveryOption);
      } else {
        localStorage.removeItem(DELIVERY_OPTION_KEY);
      }
    } catch (error) {
      console.error('Error saving delivery option to localStorage:', error);
    }
  }, [deliveryOption]);

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
    setDeliveryOption(null);
    // Also clear from localStorage
    localStorage.removeItem(ORDER_STORAGE_KEY);
    localStorage.removeItem(DELIVERY_OPTION_KEY);
  };

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
      language,
      deliveryOption,
      setDeliveryOption
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
