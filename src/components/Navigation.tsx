
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { translations, SupportedLanguage } from '@/utils/translations';
import { supabase } from '@/lib/supabase';
import { ShieldCheck } from 'lucide-react';

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      
      if (session?.user) {
        // Check if user is admin
        const { data } = await supabase
          .from('admins')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        setIsAdmin(!!data);
      }
    };
    
    checkAuth();
  }, []);

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
                className={`nav-btn text-white dark:text-white hover:text-[#ffcc00] ${activeSection === item.id ? 'active-header' : ''}`}
                data-section={item.id}
              >
                {item.label}
              </button>
            </li>
          ))}
          
          {isLoggedIn && (
            <li>
              <Link to="/profile" className="nav-btn text-white dark:text-white hover:text-[#ffcc00] block">
                My Profile
              </Link>
            </li>
          )}
          
          {!isLoggedIn && (
            <li>
              <Link to="/login" className="nav-btn text-white dark:text-white hover:text-[#ffcc00] block">
                Login
              </Link>
            </li>
          )}
          
          {isAdmin && (
            <li>
              <Link to="/admin" className="nav-btn text-white dark:text-white hover:text-[#ffcc00] flex items-center">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </li>
          )}
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
              className={`nav-btn text-black dark:text-white hover:text-[#ffcc00] font-bold ${activeSection === item.id ? 'active-header' : ''}`}
              data-section={item.id}
            >
              {item.label}
            </button>
          </li>
        ))}
        
        {isLoggedIn && (
          <li>
            <Link to="/profile" className="nav-btn text-black dark:text-white hover:text-[#ffcc00] font-bold">
              My Profile
            </Link>
          </li>
        )}
        
        {!isLoggedIn && (
          <li>
            <Link to="/login" className="nav-btn text-black dark:text-white hover:text-[#ffcc00] font-bold">
              Login
            </Link>
          </li>
        )}
        
        {isAdmin && (
          <li>
            <Link to="/admin" className="nav-btn text-black dark:text-white hover:text-[#ffcc00] font-bold flex items-center">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Admin
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};
