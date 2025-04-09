
import React from 'react';
import { UserProfile } from '@/components/profile/UserProfile';
import { Header } from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from '@/components/ui/toaster';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';

export const ProfilePage: React.FC = () => {
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
      <main className="container mx-auto py-10">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#684b2c] dark:text-white">Your Profile</h1>
          <div className="flex gap-3">
            <Link 
              to="/" 
              className="flex items-center gap-1 bg-[#684b2c] text-white px-3 py-2 rounded-md hover:bg-[#a77e58] transition-colors"
            >
              <Home size={16} />
              <span>Menu</span>
            </Link>
            <Link 
              to="/checkout" 
              className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <ShoppingBag size={16} />
              <span>Checkout</span>
            </Link>
          </div>
        </div>
        <UserProfile />
      </main>
      <Toaster />
    </>
  );
};
