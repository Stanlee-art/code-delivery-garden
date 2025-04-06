
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuEditor } from '@/components/admin/MenuEditor';
import { OrdersManager } from '@/components/admin/OrdersManager';

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }
        
        // For now, we'll set all authenticated users as admins until we implement proper admin checking
        setIsAdmin(true);
        setLoading(false);
      } catch (error: any) {
        toast({
          title: "Error checking admin permissions",
          description: error.message,
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-[#684b2c]" />
      </div>
    );
  }
  
  if (!isAdmin) {
    return null; // Navigation already handled in useEffect
  }
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#684b2c] dark:text-white">Admin Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="orders">Manage Orders</TabsTrigger>
          <TabsTrigger value="menu">Edit Menu</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="bg-white dark:bg-[#2c2c2c] p-6 rounded-lg shadow-md">
          <OrdersManager />
        </TabsContent>
        
        <TabsContent value="menu" className="bg-white dark:bg-[#2c2c2c] p-6 rounded-lg shadow-md">
          <MenuEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
};
