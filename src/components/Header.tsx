
import React from 'react';
import { Input } from "@/components/ui/input";
import { Moon, Sun, Menu } from 'lucide-react';

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
    <header className="bg-primary text-primary-foreground p-4 sticky top-0 z-10 shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-4">
          {isMobile && (
            <button 
              onClick={toggleMobileMenu}
              className="text-primary-foreground hover:text-opacity-80"
            >
              <Menu size={24} />
            </button>
          )}
          <div className="text-2xl font-bold">Damone~</div>
        </div>
        
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <Input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-36 md:w-60 bg-primary-foreground text-primary"
          />
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-opacity-20 hover:bg-primary-foreground transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-primary text-primary-foreground border border-primary-foreground rounded p-1"
          >
            <option value="en">English</option>
            <option value="sw">Swahili</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>
    </header>
  );
};
