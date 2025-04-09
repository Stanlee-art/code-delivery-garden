
import React from 'react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Toaster } from '@/components/ui/toaster';

export const AdminDashboardPage: React.FC = () => {
  return (
    <>
      <main className="container mx-auto py-10">
        <AdminDashboard />
      </main>
      <Toaster />
    </>
  );
};
