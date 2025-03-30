
import React, { useState, useEffect } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from '@/hooks/use-mobile';
import { MenuSection } from '@/components/MenuSection';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { CommentSection } from '@/components/CommentSection';
import { QRSection } from '@/components/QRSection';
import { RatingPopup } from '@/components/RatingPopup';
import { menuData } from '@/data/menuData';

const Index = () => {
  const [activeSection, setActiveSection] = useState('food');
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState<Record<string, number>>({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark');
  };

  // Change language
  const changeLanguage = (language: string) => {
    setLanguage(language);
    // In a real application, this would trigger translations
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle section change
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  // Handle rating click
  const handleRatingClick = (itemId: string, value: number) => {
    setSelectedRatings(prev => ({
      ...prev,
      [itemId]: value
    }));
    setShowRatingPopup(true);
  };

  // Handle rating submission
  const handleRatingSubmit = () => {
    // In a real application, this would submit ratings to a server
    console.log('Submitting ratings:', selectedRatings);
    setShowRatingPopup(false);
    
    // Show a notification
    const notificationElement = document.createElement('div');
    notificationElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
    notificationElement.textContent = 'Ratings submitted successfully!';
    document.body.appendChild(notificationElement);
    
    setTimeout(() => {
      document.body.removeChild(notificationElement);
    }, 3000);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-background text-foreground min-h-screen">
        <Header 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode} 
          language={language} 
          changeLanguage={changeLanguage}
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          isMobile={isMobile}
          toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        
        <main className="container mx-auto px-4 py-8">
          <Navigation 
            activeSection={activeSection} 
            handleSectionChange={handleSectionChange}
            isMobile={isMobile}
            isOpen={mobileMenuOpen}
          />
          
          {/* Food Section */}
          {activeSection === 'food' && (
            <div className="mt-8">
              <h1 className="text-3xl font-bold mb-6">Food</h1>
              
              {/* Appetizers */}
              <MenuSection 
                title="Appetizers" 
                items={menuData.appetizers}
                searchQuery={searchQuery}
                onRatingClick={handleRatingClick}
                selectedRatings={selectedRatings}
              />
              
              {/* Main Course */}
              <MenuSection 
                title="Main Course" 
                items={menuData.mainCourse}
                searchQuery={searchQuery}
                onRatingClick={handleRatingClick}
                selectedRatings={selectedRatings}
              />
              
              {/* Desserts */}
              <MenuSection 
                title="Desserts" 
                items={menuData.desserts}
                searchQuery={searchQuery}
                onRatingClick={handleRatingClick}
                selectedRatings={selectedRatings}
              />
            </div>
          )}
          
          {/* Beverages Section */}
          {activeSection === 'beverages' && (
            <div className="mt-8">
              <h1 className="text-3xl font-bold mb-6">Beverages</h1>
              <MenuSection 
                title="Beverages" 
                items={menuData.beverages}
                searchQuery={searchQuery}
                onRatingClick={handleRatingClick}
                selectedRatings={selectedRatings}
              />
            </div>
          )}
          
          {/* Order Section */}
          {activeSection === 'order' && (
            <div className="mt-8">
              <h1 className="text-3xl font-bold mb-6">Order Now</h1>
              <p className="text-lg">Start selecting food from our menu.</p>
              {/* Add order form here in a real application */}
            </div>
          )}
          
          {/* Catering Section */}
          {activeSection === 'catering' && (
            <div className="mt-8">
              <h1 className="text-3xl font-bold mb-6">Catering</h1>
              <p className="text-lg">Your catering order has been initiated.</p>
              {/* Add catering form here in a real application */}
            </div>
          )}
          
          {/* Contact Section */}
          {activeSection === 'contact' && (
            <div className="mt-8">
              <h1 className="text-3xl font-bold mb-6">Contact</h1>
              <p className="text-lg">Follow us on:</p>
              <ul className="flex space-x-4 mt-2">
                <li><a href="#" className="text-blue-500 hover:text-blue-700">Facebook</a></li>
                <li><a href="#" className="text-pink-500 hover:text-pink-700">Instagram</a></li>
                <li><a href="#" className="text-sky-500 hover:text-sky-700">Twitter</a></li>
              </ul>
            </div>
          )}
          
          {/* Comment Section - Always visible */}
          <CommentSection />
          
          {/* QR Code Section - Always visible */}
          <QRSection />
        </main>
        
        {/* Rating Popup */}
        <RatingPopup 
          isOpen={showRatingPopup} 
          onClose={() => setShowRatingPopup(false)}
          onSubmit={handleRatingSubmit}
        />
      </div>
    </div>
  );
};

export default Index;
