
import React from 'react';
import { Input } from "@/components/ui/input";
import { Moon, Sun, Menu } from 'lucide-react';
import { SupportedLanguage, translations } from '@/utils/translations';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => void;
  searchQuery: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isMobile: boolean;
  toggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  toggleDarkMode,
  language,
  changeLanguage,
  searchQuery,
  handleSearch,
  isMobile,
  toggleMobileMenu
}) => {
  // Using the same brown color from the image for consistency
  const headerBgColor = '#684b2c';
  
  return (
    <header className="flex flex-col md:flex-row md:items-center md:space-x-4 p-4 md:p-5 bg-[#684b2c] text-white">
      <div className="flex items-center justify-between w-full md:w-auto">
        {isMobile && (
          <button 
            id="menuToggle"
            onClick={toggleMobileMenu}
            className="text-white hover:text-opacity-80"
            aria-label="Toggle mobile menu"
          >
            <Menu size={24} />
          </button>
        )}
        <div className="logo text-2xl font-bold text-white">Damone~</div>
        
        {/* Mobile search */}
        {isMobile && (
          <div className="ml-2">
            <button
              id="darkModeToggle"
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-white text-[#684b2c] dark:bg-[#3a3a3a] dark:text-white"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mt-2 md:mt-0 md:ml-auto">
        <Input
          type="text"
          id="searchBar"
          placeholder="Search menu..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-60 bg-white text-[#684b2c] dark:bg-[#3a3a3a] dark:text-white"
        />
        
        {/* Desktop dark mode toggle */}
        {!isMobile && (
          <button
            id="darkModeToggle"
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-white text-[#684b2c] dark:bg-[#3a3a3a] dark:text-white"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}
        
        <select
          id="languageSelect"
          value={language}
          onChange={(e) => changeLanguage(e.target.value as SupportedLanguage)}
          className="bg-white text-[#684b2c] dark:bg-[#3a3a3a] dark:text-white border border-[#684b2c] dark:border-gray-700 rounded p-1"
          aria-label="Select language"
        >
          <option value="en">English</option>
          <option value="sw">Swahili</option>
          <option value="fr">French</option>
        </select>
      </div>
      
      {/* Notification Box */}
      <div id="notificationBox" className="notification hidden fixed top-[-50px] left-1/2 transform -translate-x-1/2 bg-[#333] text-white px-8 py-4 rounded-lg text-base font-bold z-50 opacity-0 transition-all duration-500 ease-in-out"></div>
    </header>
  );
};
