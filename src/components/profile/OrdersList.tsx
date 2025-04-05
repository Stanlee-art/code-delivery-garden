
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Loader2, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total: number;
  items: any[];
}

interface OrdersListProps {
  userId: string;
}

export const OrdersList: React.FC<OrdersListProps> = ({ userId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setOrders(data || []);
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
    
    if (userId) {
      fetchOrders();
    }
  }, [userId]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-[#684b2c]" />
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
      <div className="py-10 text-center">
        <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500 dark:text-gray-400">
          You haven't placed any orders yet.
        </p>
      </div>
    );
  }
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivering':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div 
          key={order.id} 
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(order.created_at).toLocaleString()}
              </p>
              <p className="font-medium mt-1">
                Order #{order.id.substring(0, 8)}
              </p>
            </div>
            <Badge className={`${getStatusColor(order.status)} border`}>
              {order.status}
            </Badge>
          </div>
          
          <div className="mt-3">
            <p className="text-sm">
              {order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}
            </p>
            <p className="font-medium mt-2">
              Total: ${parseFloat(order.total).toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
