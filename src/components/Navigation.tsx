
import React from 'react';

interface NavigationProps {
  activeSection: string;
  handleSectionChange: (section: string) => void;
  isMobile: boolean;
  isOpen: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  handleSectionChange,
  isMobile,
  isOpen
}) => {
  // Define navigation items
  const navItems = [
    { id: 'food', label: 'Food' },
    { id: 'beverages', label: 'Beverages' },
    { id: 'order', label: 'Order Now' },
    { id: 'catering', label: 'Catering' },
    { id: 'contact', label: 'Contact' }
  ];

  // Mobile navigation
  if (isMobile) {
    return (
      <nav className={`${isOpen ? 'show' : ''}`} id="navMenu">
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleSectionChange(item.id)}
                className={`nav-btn ${activeSection === item.id ? 'active-header' : ''}`}
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
              className={`nav-btn ${activeSection === item.id ? 'active-header' : ''}`}
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
