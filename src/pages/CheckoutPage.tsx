
import React from 'react';
import { PaymentForm } from '@/components/payment/PaymentForm';
import { Header } from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from '@/components/ui/toaster';
import { OrderProvider } from '@/contexts/OrderContext';
import { translations } from '@/utils/translations';
import { Link } from 'react-router-dom';
import { Home, User } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <Header 
        isDarkMode={false} 
        toggleDarkMode={() => {}} 
        language="en" 
        changeLanguage={() => {}}
        searchQuery=""
        handleSearch={() => {}}
        isMobile={isMobile}
        toggleMobileMenu={() => {}}
      />
      <OrderProvider language="en">
        <main className="container mx-auto py-10">
          <PaymentForm />
        </main>
      </OrderProvider>
      <Toaster />
    </>
  );
};
