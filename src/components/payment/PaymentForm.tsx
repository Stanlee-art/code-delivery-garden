
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useOrder } from '@/contexts/OrderContext';
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
import { Loader2, CreditCard, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PaymentForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [hasAddress, setHasAddress] = useState(false);
  const { orderItems, totalPrice, clearOrder } = useOrder();
  const navigate = useNavigate();

  // Fetch user's saved address if logged in
  React.useEffect(() => {
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

  const processPayment = async () => {
    if (!address) {
      toast({
        title: "Delivery address required",
        description: "Please enter your delivery address",
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

      // Save or update address
      if (!hasAddress) {
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            address,
            updated_at: new Date()
          });
      }
      
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          items: orderItems,
          total: totalPrice,
        })
        .select()
        .single();
        
      if (orderError) throw orderError;

      // For now, simulate payment success immediately
      // In a real app, this would integrate with a payment gateway API
      setTimeout(() => {
        toast({
          title: "Payment successful",
          description: "Your order has been placed successfully",
        });
        
        clearOrder();
        navigate('/profile');
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#684b2c] dark:text-white text-center">
        Complete Your Order
      </h2>
      
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
                Cash on Delivery
              </label>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              More payment methods will be available soon.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee:</span>
            <span>$2.50</span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
            <span>Total:</span>
            <span>${(totalPrice + 2.50).toFixed(2)}</span>
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
