
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';
import { translations } from '@/utils/translations';
import { ShoppingCart, CreditCard } from 'lucide-react'; 

export const OrderSummary: React.FC = () => {
  const { 
    orderItems, 
    removeFromOrder, 
    increaseQuantity, 
    decreaseQuantity, 
    totalPrice, 
    showOrderSummary, 
    setShowOrderSummary, 
    clearOrder,
    language
  } = useOrder();
  
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    setShowOrderSummary(false);
    navigate('/checkout');
  };

  return (
    <>
      <Dialog open={showOrderSummary} onOpenChange={setShowOrderSummary}>
        <DialogContent className="bg-white dark:bg-[#2c2c2c] border-[#684b2c] dark:border-[#a77e58] rounded-lg max-w-md w-11/12 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#684b2c] dark:text-white text-xl font-bold">
              {isOrderSubmitted 
                ? translations[language].orderReceived 
                : translations[language].yourOrder}
            </DialogTitle>
          </DialogHeader>
          
          {isOrderSubmitted ? (
            <div className="p-4 text-center">
              <p className="text-lg mb-4 text-[#684b2c] dark:text-white">
                {translations[language].thankYouForOrder}
              </p>
              <p className="text-sm text-[#684b2c] dark:text-white">
                {translations[language].enjoyYourMeal}
              </p>
            </div>
          ) : (
            <>
              {orderItems.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {translations[language].noItemsInOrder}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-[#684b2c] dark:text-white">{item.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ${item.price} × {item.quantity}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => increaseQuantity(item.id)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full"
                        >
                          +
                        </button>
                        <button 
                          onClick={() => removeFromOrder(item.id)}
                          className="ml-2 text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between font-bold">
                      <span className="text-[#684b2c] dark:text-white">
                        {translations[language].total}:
                      </span>
                      <span className="text-[#684b2c] dark:text-white">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
                <DialogClose className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 px-4 py-2 rounded w-full sm:w-auto">
                  {translations[language].cancel}
                </DialogClose>
                
                <Button 
                  onClick={handleProceedToCheckout}
                  disabled={orderItems.length === 0}
                  className="bg-[#684b2c] hover:bg-[#a77e58] text-white px-4 py-2 rounded w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  Checkout
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
};
