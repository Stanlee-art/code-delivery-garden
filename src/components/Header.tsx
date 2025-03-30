
import React from 'react';
import { Input } from "@/components/ui/input";
import { Moon, Sun, Menu } from 'lucide-react';
import { SupportedLanguage } from '@/utils/translations';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: string;
  changeLanguage: (lang: string) => void;
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
  return (
    <header>
      <div className="flex items-center space-x-4">
        {isMobile && (
          <button 
            id="menuToggle"
            onClick={toggleMobileMenu}
            className="text-white hover:text-opacity-80"
          >
            <Menu size={24} />
          </button>
        )}
        <div className="logo">Damone~</div>
      </div>
      
      <div className="flex items-center space-x-4 mt-2 md:mt-0">
        <Input
          type="text"
          id="searchBar"
          placeholder="Search menu..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-36 md:w-60 bg-white text-[#684b2c]"
        />
        
        <button
          id="darkModeToggle"
          onClick={toggleDarkMode}
          className="p-2 rounded-full"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <select
          id="languageSelect"
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="bg-white text-[#684b2c] border border-[#684b2c] rounded p-1"
        >
          <option value="en">English</option>
          <option value="sw">Swahili</option>
          <option value="fr">French</option>
        </select>
      </div>
      
      {/* Notification Box */}
      <div id="notificationBox" className="notification hidden"></div>
    </header>
  );
};
