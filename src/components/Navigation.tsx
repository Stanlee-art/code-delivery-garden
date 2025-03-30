
import React from 'react';
import { translations, SupportedLanguage } from '@/utils/translations';

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
  // Define navigation items using the translations
  const navItems = [
    { id: 'food', label: translations[language].food },
    { id: 'beverages', label: translations[language].beverages },
    { id: 'order', label: translations[language].orderNow },
    { id: 'catering', label: translations[language].catering },
    { id: 'contact', label: translations[language].contact }
  ];

  // Mobile navigation
  if (isMobile) {
    return (
      <nav className={`${isOpen ? 'show' : ''}`} id="navMenu">
        <ul className="bg-[#684b2c] dark:bg-[#574d41] shadow-lg">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleSectionChange(item.id)}
                className={`nav-btn text-white hover:text-[#ffcc00] ${activeSection === item.id ? 'active-header' : ''}`}
                data-section={item.id}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  // Desktop navigation
  return (
    <nav id="navMenu">
      <ul>
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => handleSectionChange(item.id)}
              className={`nav-btn text-white hover:text-[#ffcc00] font-bold ${activeSection === item.id ? 'active-header' : ''}`}
              data-section={item.id}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
