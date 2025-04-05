
import React from 'react';
import { SupportedLanguage, translations } from '@/utils/translations';
import { Facebook, Instagram, Twitter } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  handleSectionChange: (section: string) => void;
  isMobile: boolean;
  isOpen: boolean;
  language: SupportedLanguage;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  handleSectionChange,
  isMobile,
  isOpen,
  language
}) => {
  const navItems = [
    { id: 'food', name: translations[language].food },
    { id: 'beverages', name: translations[language].beverages },
    { id: 'order', name: translations[language].orderNow },
    { id: 'catering', name: translations[language].catering },
    { id: 'contact', name: translations[language].contact },
  ];

  const navClass = isMobile
    ? `fixed top-[60px] left-0 w-full bg-white dark:bg-[#222] shadow-md z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`
    : 'sticky top-0 bg-white dark:bg-[#222] shadow-md z-30';

  return (
    <nav className={navClass}>
      <ul className={`flex ${isMobile ? 'flex-col' : 'flex-row justify-center'} p-0 m-0`}>
        {navItems.map((item) => (
          <li key={item.id} className="list-none">
            <button
              id={`nav-${item.id}`}
              className={`px-4 py-2 text-lg ${
                activeSection === item.id
                  ? 'text-[#684b2c] dark:text-[#a77e58] font-bold border-b-2 border-[#684b2c] dark:border-[#a77e58]'
                  : 'text-black dark:text-white hover:text-[#684b2c] dark:hover:text-[#a77e58]'
              } ${isMobile ? 'block w-full text-left border-b border-gray-200 dark:border-gray-700' : ''}`}
              onClick={() => handleSectionChange(item.id)}
            >
              {item.name}
              {item.id === 'contact' && (
                <span className="ml-2 inline-flex space-x-1">
                  <Facebook size={16} />
                  <Instagram size={16} />
                  <Twitter size={16} />
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
