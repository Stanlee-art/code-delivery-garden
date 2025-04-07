
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MenuSection } from '@/components/MenuSection';
import { Navigation } from '@/components/Navigation';
import { QRSection } from '@/components/QRSection';
import { CateringSection } from '@/components/CateringSection';
import { CommentSection } from '@/components/CommentSection';
import { RatingPopup } from '@/components/RatingPopup';
import { OrderSummary } from '@/components/OrderSummary';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from '@/components/ui/toaster';
import { translations, SupportedLanguage } from '@/utils/translations';

const Index: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const askForRating = setTimeout(() => {
      setShowRatingPopup(true);
    }, 60000);

    return () => clearTimeout(askForRating);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const changeLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <Header 
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          language={language}
          changeLanguage={changeLanguage}
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          isMobile={isMobile}
          toggleMobileMenu={toggleMobileMenu}
        />
        
        <Navigation 
          isMobile={isMobile} 
          isMobileMenuOpen={isMobileMenuOpen} 
          language={language} 
        />
        
        <main className="container mx-auto px-4 py-8">
          <MenuSection 
            searchQuery={searchQuery} 
            language={language}
          />
          
          <QRSection language={language} />
          <CateringSection language={language} />
          <CommentSection language={language} />
        </main>
        
        <OrderSummary />
        
        {showRatingPopup && (
          <RatingPopup 
            onClose={() => setShowRatingPopup(false)}
            language={language}
          />
        )}

        <Toaster />
      </div>
    </div>
  );
};

export default Index;
