
import React, { useState, useEffect } from 'react';
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
    document.body.classList.toggle('dark-mode');
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
    const notificationElement = document.getElementById('notificationBox');
    if (notificationElement) {
      notificationElement.textContent = 'Ratings submitted successfully!';
      notificationElement.classList.remove('hidden');
      notificationElement.classList.add('show');
      
      setTimeout(() => {
        notificationElement.classList.remove('show');
        notificationElement.classList.add('hidden');
      }, 3000);
    }
  };

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
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
      
      <main>
        <Navigation 
          activeSection={activeSection} 
          handleSectionChange={handleSectionChange}
          isMobile={isMobile}
          isOpen={mobileMenuOpen}
        />
        
        {/* Food Section */}
        {activeSection === 'food' && (
          <section id="food" className="menu-category">
            <h1 id="foodHeading">Food</h1>
            <div id="menuCategories">
              {/* Appetizers */}
              <section id="appetizersSection">
                <MenuSection 
                  title="Appetizers" 
                  items={menuData.appetizers}
                  searchQuery={searchQuery}
                  onRatingClick={handleRatingClick}
                  selectedRatings={selectedRatings}
                />
              </section>
              
              {/* Main Course */}
              <section id="mainCourseSection">
                <MenuSection 
                  title="Main Course" 
                  items={menuData.mainCourse}
                  searchQuery={searchQuery}
                  onRatingClick={handleRatingClick}
                  selectedRatings={selectedRatings}
                />
              </section>
              
              {/* Desserts */}
              <section id="dessertsSection">
                <MenuSection 
                  title="Desserts" 
                  items={menuData.desserts}
                  searchQuery={searchQuery}
                  onRatingClick={handleRatingClick}
                  selectedRatings={selectedRatings}
                />
              </section>
            </div>
          </section>
        )}
        
        {/* Beverages Section */}
        {activeSection === 'beverages' && (
          <section id="beverages" className="menu-category">
            <h2 id="beveragesHeading">Beverages</h2>
            <MenuSection 
              title="Beverages" 
              items={menuData.beverages}
              searchQuery={searchQuery}
              onRatingClick={handleRatingClick}
              selectedRatings={selectedRatings}
            />
          </section>
        )}
        
        {/* Order Section */}
        {activeSection === 'order' && (
          <section id="order" className="menu-category">
            <h2 id="orderNowButton">Order Now</h2>
            <p>Start selecting food from our menu.</p>
          </section>
        )}
        
        {/* Catering Section */}
        {activeSection === 'catering' && (
          <section id="catering" className="menu-category">
            <h2 id="cateringHeading">Catering</h2>
            <p>Your catering order has been initiated.</p>
          </section>
        )}
        
        {/* Contact Section */}
        {activeSection === 'contact' && (
          <section id="contact" className="menu-category">
            <h2 id="contactHeading">Contact</h2>
            <p>Follow us on:</p>
            <ul className="flex justify-center space-x-4 mt-2">
              <li><a href="#" className="text-blue-500 hover:text-blue-700">Facebook</a></li>
              <li><a href="#" className="text-pink-500 hover:text-pink-700">Instagram</a></li>
              <li><a href="#" className="text-sky-500 hover:text-sky-700">Twitter</a></li>
            </ul>
          </section>
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
  );
};

export default Index;
