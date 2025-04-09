
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface LocationFormProps {
  initialAddress: string;
  userId: string;
  onComplete: () => void;
}

export const LocationForm: React.FC<LocationFormProps> = ({ 
  initialAddress, 
  userId,
  onComplete
}) => {
  const [address, setAddress] = useState(initialAddress);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: userId,
          address: address,
          updated_at: new Date()
        });
        
      if (error) throw error;
      
      toast({
        title: "Address updated",
        description: "Your delivery location has been saved.",
      });
      
      onComplete();
    } catch (error: any) {
      toast({
        title: "Error updating address",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3">
      <Textarea
        placeholder="Enter your delivery address..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        rows={3}
        required
      />
      
      <div className="flex gap-2 justify-end">
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={onComplete}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          size="sm"
          disabled={loading}
          className="bg-[#684b2c] hover:bg-[#a77e58]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Address'
          )}
        </Button>
      </div>
    </form>
  );
};
