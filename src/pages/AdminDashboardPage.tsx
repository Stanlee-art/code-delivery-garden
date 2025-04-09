
import React from 'react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Toaster } from '@/components/ui/toaster';
import { Link } from 'react-router-dom';
import { Home, User } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  return (
    <>
      <header className="bg-[#684b2c] text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Restaurant Admin</h1>
          <div className="flex gap-3">
            <Link to="/" className="flex items-center gap-1 bg-[#a77e58] text-white px-3 py-1 rounded-md hover:bg-[#8c6648] transition-colors">
              <Home size={16} />
              <span>Menu</span>
            </Link>
            <Link to="/profile" className="flex items-center gap-1 bg-[#a77e58] text-white px-3 py-1 rounded-md hover:bg-[#8c6648] transition-colors">
              <User size={16} />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-10">
        <AdminDashboard />
      </main>
      <Toaster />
    </>
  );
};
