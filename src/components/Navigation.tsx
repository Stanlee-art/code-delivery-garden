
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
      <nav className={`fixed left-0 top-16 w-64 h-screen bg-sidebar z-20 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <ul className="p-4 space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleSectionChange(item.id)}
                className={`w-full text-left p-3 rounded ${activeSection === item.id ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'hover:bg-sidebar-accent text-sidebar-foreground'}`}
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
    <nav className="mt-4">
      <ul className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => handleSectionChange(item.id)}
              className={`px-4 py-2 rounded transition-colors ${activeSection === item.id ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-primary/20'}`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
