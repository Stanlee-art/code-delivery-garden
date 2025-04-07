
import React, { useEffect, useState } from 'react';
import { PaymentForm } from '@/components/payment/PaymentForm';
import { Header } from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from '@/components/ui/toaster';
import { translations } from '@/utils/translations';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, User, ShoppingBag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { DeliveryOptionDialog } from '@/components/DeliveryOptionDialog';

export const CheckoutPage: React.FC = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDeliveryOptions, setShowDeliveryOptions] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to complete your order",
          variant: "destructive",
        });
        navigate('/login');
      }
    };
    
    checkUser();
  }, [navigate]);
  
  return (
    <>
      <header className="bg-[#684b2c] text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Checkout</h1>
          <div className="flex gap-3">
            <Link to="/" className="flex items-center gap-1 bg-[#a77e58] text-white px-3 py-1 rounded-md hover:bg-[#8c6648] transition-colors">
              <Home size={16} />
              <span>Menu</span>
            </Link>
            <Link to="/profile" className="flex items-center gap-1 bg-[#a77e58] text-white px-3 py-1 rounded-md hover:bg-[#8c6648] transition-colors">
              <User size={16} />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-10">
        <PaymentForm onShowDeliveryOptions={() => setShowDeliveryOptions(true)} />
      </main>
      <DeliveryOptionDialog 
        open={showDeliveryOptions} 
        onOpenChange={setShowDeliveryOptions} 
      />
      <Toaster />
    </>
  );
};
