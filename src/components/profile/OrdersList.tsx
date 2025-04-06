
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Loader2, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OrdersListProps {
  userId: string;
}

interface OrderItem {
  id: string;
  created_at: string;
  status: string;
  total: number | string;
  items: any[];
}

export const OrdersList: React.FC<OrdersListProps> = ({ userId }) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchOrders();
  }, [userId]);
  
  const fetchOrders = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const processedOrders = (data || []).map(order => ({
        ...order,
        // Ensure items is always an array
        items: Array.isArray(order.items) ? order.items : []
      }));
      
      setOrders(processedOrders);
    } catch (error: any) {
      toast({
        title: "Error loading orders",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'delivering':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-[#684b2c]" />
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 mx-auto text-gray-400" />
        <p className="mt-4 text-gray-500 dark:text-gray-400">You don't have any orders yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div 
          key={order.id}
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-medium">Order #{order.id.substring(0, 8)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
              </p>
            </div>
            <Badge className={getStatusBadgeColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm">
              <span className="font-medium">Items:</span> {order.items?.length || 0}
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">Total:</span> ${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
