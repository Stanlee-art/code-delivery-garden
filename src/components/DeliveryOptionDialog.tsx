
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useOrder, DeliveryOption } from '@/contexts/OrderContext';
import { Truck, Utensils } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface DeliveryOptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeliveryOptionDialog: React.FC<DeliveryOptionDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { setDeliveryOption, orderItems } = useOrder();
  const navigate = useNavigate();
  const location = useLocation();

  const handleOptionSelect = (option: DeliveryOption) => {
    if (orderItems.length === 0) {
      toast({
        title: "Empty cart",
        description: "Please add items to your order first",
        variant: "destructive",
      });
      onOpenChange(false);
      return;
    }
    
    setDeliveryOption(option);
    onOpenChange(false);
    
    // Always navigate to checkout after selecting a delivery option
    navigate('/checkout');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How would you like your order?</DialogTitle>
          <DialogDescription>
            Choose whether you want your food delivered or if you'll dine in at our restaurant.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-32 hover:bg-[#f9f3ec] hover:border-[#684b2c]"
            onClick={() => handleOptionSelect('delivery')}
          >
            <Truck className="h-12 w-12 mb-2 text-[#684b2c]" />
            <span className="font-medium">Delivery</span>
            <span className="text-xs text-gray-500">Delivered to your address</span>
          </Button>

          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-32 hover:bg-[#f9f3ec] hover:border-[#684b2c]"
            onClick={() => handleOptionSelect('dine-in')}
          >
            <Utensils className="h-12 w-12 mb-2 text-[#684b2c]" />
            <span className="font-medium">Dine In</span>
            <span className="text-xs text-gray-500">Eat at the restaurant</span>
          </Button>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button 
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
