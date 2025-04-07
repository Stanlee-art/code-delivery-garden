
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useOrder, DeliveryOption } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, CreditCard, MapPin, ShoppingBag, Utensils, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface PaymentFormProps {
  onShowDeliveryOptions?: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onShowDeliveryOptions }) => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [hasAddress, setHasAddress] = useState(false);
  const { orderItems, totalPrice, clearOrder, deliveryOption } = useOrder();
  const navigate = useNavigate();

  // Fetch user's saved address if logged in
  useEffect(() => {
    const getUserAddress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('address')
            .eq('id', user.id)
            .single();
            
          if (error && error.code !== 'PGRST116') throw error;
          
          if (data?.address) {
            setAddress(data.address);
            setHasAddress(true);
          }
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    };
    
    getUserAddress();
  }, []);

  // Redirect if cart is empty - adding debug logs to understand the issue
  useEffect(() => {
    console.log('Order items in PaymentForm:', orderItems);
    
    if (orderItems.length === 0) {
      console.log('Cart is empty, redirecting to home');
      toast({
        title: "Empty cart",
        description: "Please add items to your cart before checkout",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [orderItems, navigate]);

  // If no delivery option is selected, show a message and button to select one
  if (deliveryOption === null) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Delivery Option Required
          </CardTitle>
          <CardDescription>
            Please select how you would like your order
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="mb-4">You need to select whether you want delivery or dine-in before proceeding to checkout.</p>
          <Button 
            onClick={onShowDeliveryOptions}
            className="bg-[#684b2c] hover:bg-[#a77e58]"
          >
            Select Delivery Option
          </Button>
        </CardContent>
      </Card>
    );
  }

  const processPayment = async () => {
    // Check if address is required and provided
    if (deliveryOption === 'delivery' && !address) {
      toast({
        title: "Delivery address required",
        description: "Please enter your delivery address",
        variant: "destructive",
      });
      return;
    }

    if (orderItems.length === 0) {
      toast({
        title: "Empty order",
        description: "Please add items to your order before proceeding",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in before completing your order",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      // Save or update address if this is a delivery order
      if (deliveryOption === 'delivery') {
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            address,
            updated_at: new Date().toISOString()
          });
      }
      
      // Prepare order items for storage
      const serializableItems = orderItems.map(item => ({
        id: item.id,
        name: item.name,
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
        quantity: item.quantity,
        description: item.description || null,
        image: item.image || null,
        category: item.category || null
      }));
      
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: deliveryOption === 'delivery' ? 'preparing' : 'pending',
          items: serializableItems,
          total: totalPrice + (deliveryOption === 'delivery' ? 2.50 : 0),
          delivery_type: deliveryOption
        })
        .select();
        
      if (orderError) throw orderError;

      // Success
      toast({
        title: "Order confirmed!",
        description: deliveryOption === 'delivery' 
          ? "Your order is being prepared for delivery" 
          : "Your order is being prepared for dine-in",
      });
      
      clearOrder();
      navigate('/profile');
    } catch (error: any) {
      console.error('Order submission error:', error);
      toast({
        title: "Order submission failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add debugging to check if order items exist
  console.log('Rendering PaymentForm with orderItems:', orderItems);

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#684b2c] dark:text-white">
          Complete Your Order
        </h2>
        <div className="flex gap-2">
          <Link to="/" className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Menu
          </Link>
          <Link to="/profile" className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Profile
          </Link>
        </div>
      </div>
      
      <div className="mb-6 flex items-center">
        <Badge className="bg-[#684b2c] text-white">
          {deliveryOption === 'delivery' ? (
            <div className="flex items-center gap-2">
              <Truck className="h-3 w-3" />
              <span>Delivery</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Utensils className="h-3 w-3" />
              <span>Dine-In</span>
            </div>
          )}
        </Badge>
      </div>
      
      {deliveryOption === 'delivery' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Address
            </CardTitle>
            <CardDescription>
              Where should we deliver your order?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-3 bg-white dark:bg-gray-800"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your delivery address..."
              required
            />
          </CardContent>
        </Card>
      )}
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </CardTitle>
          <CardDescription>
            Choose your payment method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="radio"
                id="cashOnDelivery"
                name="paymentMethod"
                value="cashOnDelivery"
                checked
                className="w-4 h-4 text-[#684b2c] focus:ring-[#684b2c]"
                readOnly
              />
              <label htmlFor="cashOnDelivery" className="ml-2 text-sm font-medium">
                {deliveryOption === 'delivery' ? 'Cash on Delivery' : 'Pay at Restaurant'}
              </label>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              More payment methods will be available soon.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Order Summary
          </CardTitle>
          <CardDescription>
            {orderItems.length} item(s) in your order
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderItems.length > 0 ? (
            <div className="max-h-60 overflow-y-auto mb-4">
              {orderItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">x{item.quantity}</p>
                  </div>
                  <p className="font-medium">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No items in your order</p>
          )}

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            {deliveryOption === 'delivery' && (
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>$2.50</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2 flex justify-between font-bold">
              <span>Total:</span>
              <span>${(totalPrice + (deliveryOption === 'delivery' ? 2.50 : 0)).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-[#684b2c] hover:bg-[#a77e58]"
            onClick={processPayment}
            disabled={loading || orderItems.length === 0}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm Order'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
