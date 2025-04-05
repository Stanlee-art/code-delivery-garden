
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Loader2, LogOut, MapPin, Clock, Package } from 'lucide-react';
import { OrdersList } from '@/components/profile/OrdersList';
import { LocationForm } from '@/components/profile/LocationForm';

export const UserProfile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get user profile information
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error && error.code !== 'PGRST116') {
            throw error;
          }
          
          setUserProfile({
            ...user,
            ...data
          });
        } else {
          navigate('/login');
        }
      } catch (error: any) {
        toast({
          title: "Error loading profile",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    getUserProfile();
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Logout failed",
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
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#684b2c] dark:text-white">My Profile</h1>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="bg-white dark:bg-[#2c2c2c] p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-[#684b2c] dark:text-white">Account Details</h2>
            
            <div className="space-y-3">
              <p><span className="font-medium">Email:</span> {userProfile?.email}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#684b2c] dark:text-[#a77e58]" />
                  <span className="font-medium">Delivery Location:</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowLocationForm(!showLocationForm)}
                >
                  {userProfile?.address ? "Update" : "Add"}
                </Button>
              </div>
              
              {userProfile?.address && (
                <p className="text-gray-600 dark:text-gray-400 pl-7">
                  {userProfile?.address}
                </p>
              )}
              
              {showLocationForm && (
                <LocationForm 
                  initialAddress={userProfile?.address || ''}
                  userId={userProfile?.id}
                  onComplete={() => {
                    setShowLocationForm(false);
                    // Refresh user profile
                    window.location.reload();
                  }}
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white dark:bg-[#2c2c2c] p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-[#684b2c] dark:text-[#a77e58]" />
              <h2 className="text-xl font-semibold text-[#684b2c] dark:text-white">Order History</h2>
            </div>
            
            <OrdersList userId={userProfile?.id} />
          </div>
        </div>
      </div>
    </div>
  );
};
