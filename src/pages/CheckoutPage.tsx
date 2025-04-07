
import React from 'react';
import { PaymentForm } from '@/components/payment/PaymentForm';
import { Header } from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from '@/components/ui/toaster';
import { OrderProvider } from '@/contexts/OrderContext';
import { translations } from '@/utils/translations';
import { Link } from 'react-router-dom';
import { Home, User, ShoppingBag } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const isMobile = useIsMobile();
  
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
        <PaymentForm />
      </main>
      <Toaster />
    </>
  );
};
