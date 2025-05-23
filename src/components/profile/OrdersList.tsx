
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Loader2, Package, ExternalLink, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface OrdersListProps {
  userId: string;
}

interface OrderItem {
  id: string;
  created_at: string;
  status: string;
  total: number | string;
  items: any[];
  delivery_type?: 'delivery' | 'dine-in';
}

export const OrdersList: React.FC<OrdersListProps> = ({ userId }) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);
  const navigate = useNavigate();
  
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
      
      // Process orders to ensure items is always an array
      const processedOrders = (data || []).map(order => {
        // Handle items properly
        let processedItems: any[] = [];
        
        if (typeof order.items === 'string') {
          try {
            processedItems = JSON.parse(order.items);
          } catch (e) {
            console.error('Error parsing order items string:', e);
            processedItems = [];
          }
        } else if (Array.isArray(order.items)) {
          processedItems = order.items;
        } else if (order.items && typeof order.items === 'object') {
          // Handle case where items might be a JSON object but not an array
          processedItems = [order.items];
        }
        
        return {
          ...order,
          items: processedItems
        } as OrderItem;
      });
      
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

  const confirmDelivery = async (orderId: string) => {
    try {
      setConfirmingOrderId(orderId);
      
      const { error } = await supabase
        .from('orders')
        .update({ status: 'delivered' })
        .eq('id', orderId);
        
      if (error) throw error;
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId
          ? { ...order, status: 'delivered' }
          : order
      ));
      
      toast({
        title: "Delivery confirmed",
        description: "Thanks for confirming your order delivery!",
      });
    } catch (error: any) {
      toast({
        title: "Error confirming delivery",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setConfirmingOrderId(null);
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
  
  const handleBackToMenu = () => {
    navigate('/');
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
        <Button 
          onClick={handleBackToMenu}
          className="mt-4 bg-[#684b2c] hover:bg-[#a77e58]"
        >
          Browse Menu
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#684b2c] dark:text-white">Your Orders</h2>
        <Button
          variant="outline"
          onClick={handleBackToMenu}
          className="flex items-center gap-2"
        >
          <ExternalLink size={16} />
          Back to Menu
        </Button>
      </div>
      
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
                {order.delivery_type && (
                  <Badge variant="outline" className="mt-1">
                    {order.delivery_type === 'delivery' ? 'Delivery' : 'Dine-In'}
                  </Badge>
                )}
              </div>
              <Badge className={getStatusBadgeColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              {order.items && order.items.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm font-medium mb-1">Order Items:</p>
                  <ul className="text-sm space-y-1 pl-2">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{item.name} × {item.quantity}</span>
                        <span>${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <p className="text-sm mt-2">
                <span className="font-medium">Total:</span> ${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}
              </p>
              
              {order.delivery_type === 'delivery' && order.status === 'delivering' && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2 border-green-500 hover:bg-green-50 dark:hover:bg-green-900 text-green-700 dark:text-green-400"
                    onClick={() => confirmDelivery(order.id)}
                    disabled={!!confirmingOrderId}
                  >
                    {confirmingOrderId === order.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Confirm Receipt
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
