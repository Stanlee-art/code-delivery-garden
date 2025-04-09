
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Loader2, Filter, Search, Truck, Utensils } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total: number;
  items: any[];
  user_id: string;
  user_email?: string;
  address?: string;
  delivery_type?: 'delivery' | 'dine-in';
}

export const OrdersManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select(`*`);
        
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data: orderData, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Fetch user profiles separately for each order
      const ordersWithUserDetails = await Promise.all((orderData || []).map(async (order) => {
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('email, address')
            .eq('id', order.user_id)
            .single();
          
          return {
            ...order,
            user_email: profileData?.email,
            address: profileData?.address,
            // Ensure items is always an array
            items: Array.isArray(order.items) ? order.items : [],
          } as Order;
        } catch (err) {
          // If profile fetch fails, return order without profile details
          return {
            ...order,
            user_email: undefined,
            address: undefined,
            // Ensure items is always an array
            items: Array.isArray(order.items) ? order.items : [],
          } as Order;
        }
      }));
      
      setOrders(ordersWithUserDetails);
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
  
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
        
      if (error) throw error;
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus } 
            : order
        )
      );
      
      toast({
        title: "Order updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(query) ||
      order.user_email?.toLowerCase().includes(query) ||
      order.address?.toLowerCase().includes(query)
    );
  });
  
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
    <div>
      <h2 className="text-xl font-semibold mb-6 text-[#684b2c] dark:text-white">Manage Orders</h2>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-5 w-5 text-gray-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="delivering">Delivering</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="relative flex-grow">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          onClick={fetchOrders}
          variant="outline"
          className="whitespace-nowrap"
        >
          <Loader2 className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-[#684b2c]" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery 
              ? "No orders found matching your search criteria" 
              : statusFilter !== 'all'
                ? `No orders with status: ${statusFilter}` 
                : "No orders found"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <div 
              key={order.id} 
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Order #{order.id.substring(0, 8)}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    {order.delivery_type && (
                      <Badge variant="outline" className="ml-2">
                        {order.delivery_type === 'delivery' ? (
                          <span className="flex items-center gap-1">
                            <Truck className="h-3 w-3" /> Delivery
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Utensils className="h-3 w-3" /> Dine-in
                          </span>
                        )}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                
                <Select 
                  value={order.status} 
                  onValueChange={value => updateOrderStatus(order.id, value)}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="delivering">Delivering</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Customer Details</h4>
                  <p className="text-sm">Email: {order.user_email || 'N/A'}</p>
                  {order.delivery_type === 'delivery' && (
                    <p className="text-sm mt-1">Delivery Address: {order.address || 'N/A'}</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Order Summary</h4>
                  <p className="text-sm">Items: {order.items?.length || 0}</p>
                  <p className="text-sm font-semibold mt-1">
                    Total: ${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}
                  </p>
                </div>
              </div>
              
              {order.items && order.items.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Order Items</h4>
                  <div className="max-h-40 overflow-y-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b dark:border-gray-700">
                          <th className="text-left text-xs font-medium py-2">Item</th>
                          <th className="text-left text-xs font-medium py-2">Qty</th>
                          <th className="text-left text-xs font-medium py-2">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, index) => (
                          <tr key={index} className="border-b dark:border-gray-800">
                            <td className="py-2 text-sm">{item.name}</td>
                            <td className="py-2 text-sm">{item.quantity}</td>
                            <td className="py-2 text-sm">${item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
