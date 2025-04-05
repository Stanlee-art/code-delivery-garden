
import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Header } from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from '@/components/ui/toaster';

export const LoginPage: React.FC = () => {
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
        <LoginForm />
      </main>
      <Toaster />
    </>
  );
};
