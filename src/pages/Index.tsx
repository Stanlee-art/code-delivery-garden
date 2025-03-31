
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MenuSection } from '@/components/MenuSection';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { CommentSection } from '@/components/CommentSection';
import { QRSection } from '@/components/QRSection';
import { RatingPopup } from '@/components/RatingPopup';
import { OrderSummary } from '@/components/OrderSummary';
import { OrderProvider, useOrder } from '@/contexts/OrderContext';
import { menuData } from '@/data/menuData';
import { translations, SupportedLanguage } from '@/utils/translations';
import { Toaster } from '@/components/ui/toaster';

const OrderButton = () => {
  const { totalItems, setShowOrderSummary, language } = useOrder();
  
  return (
    <button 
      className="fixed bottom-5 right-5 bg-[#684b2c] hover:bg-[#a77e58] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-transform transform hover:scale-110"
      onClick={() => setShowOrderSummary(true)}
    >
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </div>
    </button>
  );
};

const MenuContent = ({ 
  activeSection, 
  searchQuery, 
  onRatingClick, 
  selectedRatings, 
  showCategoryPopup, 
  setShowCategoryPopup, 
  handleCategorySelect,
}) => {
  const { language } = useOrder();
  
  return (
    <>
      {/* Food Section */}
      {activeSection === 'food' && (
        <section id="food" className="menu-category">
          <h1 
            id="foodHeading" 
            onClick={() => setShowCategoryPopup(!showCategoryPopup)}
            className={`cursor-pointer text-black dark:text-white ${showCategoryPopup ? 'active-header' : ''}`}
          >
            {translations[language].food}
          </h1>
          
          {/* Category Popup */}
          {showCategoryPopup && (
            <div id="categoryPopup" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg z-50 w-80">
              <p className="font-bold mb-4">Choose a category:</p>
              <div className="space-y-2">
                <button 
                  className="w-full bg-[#684b2c] hover:bg-[#a77e58] text-white p-2 rounded transition transform hover:scale-105"
                  onClick={() => handleCategorySelect('appetizersSection')}
                >
                  {translations[language].appetizers}
                </button>
                <button 
                  className="w-full bg-[#684b2c] hover:bg-[#a77e58] text-white p-2 rounded transition transform hover:scale-105"
                  onClick={() => handleCategorySelect('mainCourseSection')}
                >
                  {translations[language].mainCourse}
                </button>
                <button 
                  className="w-full bg-[#684b2c] hover:bg-[#a77e58] text-white p-2 rounded transition transform hover:scale-105"
                  onClick={() => handleCategorySelect('dessertsSection')}
                >
                  {translations[language].desserts}
                </button>
                <button 
                  id="cancelBtn"
                  className="w-full bg-[#a77e58] hover:bg-[#574d41] text-white p-2 rounded mt-4 transition transform hover:scale-105"
                  onClick={() => setShowCategoryPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <div id="menuCategories">
            {/* Appetizers */}
            <section id="appetizersSection">
              <MenuSection 
                title={translations[language].appetizers}
                items={menuData.appetizers}
                searchQuery={searchQuery}
                onRatingClick={onRatingClick}
                selectedRatings={selectedRatings}
              />
            </section>
            
            {/* Main Course */}
            <section id="mainCourseSection">
              <MenuSection 
                title={translations[language].mainCourse}
                items={menuData.mainCourse}
                searchQuery={searchQuery}
                onRatingClick={onRatingClick}
                selectedRatings={selectedRatings}
              />
            </section>
            
            {/* Desserts */}
            <section id="dessertsSection">
              <MenuSection 
                title={translations[language].desserts}
                items={menuData.desserts}
                searchQuery={searchQuery}
                onRatingClick={onRatingClick}
                selectedRatings={selectedRatings}
              />
            </section>
          </div>
        </section>
      )}
      
      {/* Beverages Section */}
      {activeSection === 'beverages' && (
        <section id="beverages" className="menu-category">
          <h2 id="beveragesHeading" className="text-black dark:text-white">{translations[language].beverages}</h2>
          <MenuSection 
            title={translations[language].beverages}
            items={menuData.beverages}
            searchQuery={searchQuery}
            onRatingClick={onRatingClick}
            selectedRatings={selectedRatings}
          />
        </section>
      )}
      
      {/* Order Section */}
      {activeSection === 'order' && (
        <section id="order" className="menu-category">
          <h2 id="orderNowButton" className="text-black dark:text-white">{translations[language].orderNow}</h2>
          <p>{translations[language].startSelectingFood}</p>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{translations[language].appetizers}</h3>
              <MenuSection 
                title=""
                items={menuData.appetizers}
                searchQuery={searchQuery}
                onRatingClick={onRatingClick}
                selectedRatings={selectedRatings}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">{translations[language].mainCourse}</h3>
              <MenuSection 
                title=""
                items={menuData.mainCourse}
                searchQuery={searchQuery}
                onRatingClick={onRatingClick}
                selectedRatings={selectedRatings}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">{translations[language].desserts}</h3>
              <MenuSection 
                title=""
                items={menuData.desserts}
                searchQuery={searchQuery}
                onRatingClick={onRatingClick}
                selectedRatings={selectedRatings}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">{translations[language].beverages}</h3>
              <MenuSection 
                title=""
                items={menuData.beverages}
                searchQuery={searchQuery}
                onRatingClick={onRatingClick}
                selectedRatings={selectedRatings}
              />
            </div>
          </div>
        </section>
      )}
      
      {/* Catering Section */}
      {activeSection === 'catering' && (
        <section id="catering" className="menu-category">
          <h2 id="cateringHeading" className="text-black dark:text-white">{translations[language].catering}</h2>
          <p>Your catering order has been initiated.</p>
        </section>
      )}
      
      {/* Contact Section */}
      {activeSection === 'contact' && (
        <section id="contact" className="menu-category">
          <h2 id="contactHeading" className="text-black dark:text-white">{translations[language].contact}</h2>
          <p>Follow us on:</p>
          <ul className="flex justify-center space-x-4 mt-2">
            <li><a href="#" className="text-blue-500 hover:text-blue-700">Facebook</a></li>
            <li><a href="#" className="text-pink-500 hover:text-pink-700">Instagram</a></li>
            <li><a href="#" className="text-sky-500 hover:text-sky-700">Twitter</a></li>
          </ul>
        </section>
      )}
    </>
  );
};

const Index = () => {
  const [activeSection, setActiveSection] = useState('food');
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState<Record<string, number>>({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);

  // Load dark mode preference from localStorage on component mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }

    // Load saved ratings
    const loadSavedRatings = () => {
      const savedRatings: Record<string, number> = {};
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('rating-')) {
          const itemId = key.replace('rating-', '');
          const rating = parseInt(localStorage.getItem(key) || '0');
          if (!isNaN(rating)) {
            savedRatings[itemId] = rating;
          }
        }
      });
      setSelectedRatings(savedRatings);
    };

    loadSavedRatings();
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  // Change language
  const changeLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
    const langName = lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'Swahili';
    showNotification(`Language changed to ${langName}`);
  };

  // Show notification
  const showNotification = (message: string) => {
    const notificationElement = document.getElementById('notificationBox');
    if (notificationElement) {
      notificationElement.textContent = message;
      notificationElement.classList.remove('hidden');
      notificationElement.classList.add('show');
      
      setTimeout(() => {
        notificationElement.classList.remove('show');
        notificationElement.classList.add('hidden');
      }, 3000);
    }
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
    const newRatings = {
      ...selectedRatings,
      [itemId]: value
    };
    
    setSelectedRatings(newRatings);
    localStorage.setItem(`rating-${itemId}`, value.toString());
    setShowRatingPopup(true);
  };

  // Handle rating submission
  const handleRatingSubmit = () => {
    // In a real application, this would submit ratings to a server
    console.log('Submitting ratings:', selectedRatings);
    setShowRatingPopup(false);
    showNotification('Ratings submitted successfully!');
  };

  // Toggle food category popup
  const toggleCategoryPopup = () => {
    setShowCategoryPopup(!showCategoryPopup);
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    const element = document.getElementById(category);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setShowCategoryPopup(false);
  };

  return (
    <OrderProvider language={language}>
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
            language={language}
          />
          
          <MenuContent 
            activeSection={activeSection}
            searchQuery={searchQuery}
            onRatingClick={handleRatingClick}
            selectedRatings={selectedRatings}
            showCategoryPopup={showCategoryPopup}
            setShowCategoryPopup={setShowCategoryPopup}
            handleCategorySelect={handleCategorySelect}
          />
          
          {/* Comment Section - Always visible */}
          <CommentSection />
          
          {/* QR Code Section - Always visible */}
          <QRSection />

          {/* Order button (floating) */}
          <OrderButton />
          
          {/* Order Summary Dialog */}
          <OrderSummary />
        </main>
        
        {/* Rating Popup */}
        <RatingPopup 
          isOpen={showRatingPopup} 
          onClose={() => setShowRatingPopup(false)}
          onSubmit={handleRatingSubmit}
        />
        
        <Toaster />
      </div>
    </OrderProvider>
  );
};

export default Index;
