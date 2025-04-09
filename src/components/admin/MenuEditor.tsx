
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MenuItemType } from '@/types/menu';

type MenuItem = MenuItemType;

export const MenuEditor: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewItem, setIsNewItem] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Form state
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: 'appetizers',
  });
  
  useEffect(() => {
    fetchMenuItems();
  }, [categoryFilter]);
  
  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('menu_items')
        .select('*');
        
      if (categoryFilter && categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Convert price to number if it's a string for backward compatibility
      const typedData = (data || []).map(item => ({
        ...item,
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
      })) as MenuItem[];
      
      setMenuItems(typedData);
    } catch (error: any) {
      toast({
        title: "Error loading menu items",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setForm({
      name: item.name,
      price: item.price.toString(),
      description: item.description || '',
      image: item.image || '',
      category: item.category || 'appetizers',
    });
    setIsNewItem(false);
    setIsDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedItem(null);
    setForm({
      name: '',
      price: '',
      description: '',
      image: '',
      category: 'appetizers',
    });
    setIsNewItem(true);
    setIsDialogOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Item deleted",
        description: "Menu item has been removed",
      });
      
      // Update local state
      setMenuItems(prev => prev.filter(item => item.id !== id));
    } catch (error: any) {
      toast({
        title: "Error deleting item",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!form.name || !form.price || !form.category) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const priceAsNumber = parseFloat(form.price);
      
      if (isNewItem) {
        const { data, error } = await supabase
          .from('menu_items')
          .insert({
            name: form.name,
            price: priceAsNumber,
            description: form.description || null,
            image: form.image || null,
            category: form.category,
          })
          .select();
          
        if (error) throw error;
        
        toast({
          title: "Item added",
          description: "New menu item has been added",
        });
        
        if (data && data.length > 0) {
          const newItem = {
            ...data[0],
            price: priceAsNumber
          } as MenuItem;
          
          setMenuItems(prev => [...prev, newItem]);
        }
      } else if (selectedItem) {
        const { error } = await supabase
          .from('menu_items')
          .update({
            name: form.name,
            price: priceAsNumber,
            description: form.description || null,
            image: form.image || null,
            category: form.category,
          })
          .eq('id', selectedItem.id);
          
        if (error) throw error;
        
        toast({
          title: "Item updated",
          description: "Menu item has been updated",
        });
        
        // Update local state
        setMenuItems(prev => 
          prev.map(item => 
            item.id === selectedItem.id 
              ? { 
                  ...item, 
                  name: form.name,
                  price: priceAsNumber,
                  description: form.description,
                  image: form.image,
                  category: form.category,
                } 
              : item
          )
        );
      }
      
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error saving item",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'appetizers': return 'Appetizers';
      case 'mainCourse': return 'Main Course';
      case 'desserts': return 'Desserts';
      case 'beverages': return 'Beverages';
      default: return category;
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#684b2c] dark:text-white">Menu Editor</h2>
        <Button 
          onClick={handleAddNew}
          className="bg-[#684b2c] hover:bg-[#a77e58] flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add New Item
        </Button>
      </div>
      
      <div className="flex gap-4 mb-6">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="appetizers">Appetizers</SelectItem>
            <SelectItem value="mainCourse">Main Course</SelectItem>
            <SelectItem value="desserts">Desserts</SelectItem>
            <SelectItem value="beverages">Beverages</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          onClick={fetchMenuItems}
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
      ) : menuItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">
            {categoryFilter !== 'all'
              ? `No items found in the ${getCategoryName(categoryFilter)} category` 
              : "No menu items found"}
          </p>
          <Button 
            onClick={handleAddNew}
            variant="outline"
            className="mt-4"
          >
            Add Your First Menu Item
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map(item => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <span className="font-semibold">${item.price}</span>
                </div>
                <CardDescription>
                  {getCategoryName(item.category)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.description || 'No description'}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(item)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-1"
                >
                  <Trash className="h-3 w-3" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isNewItem ? 'Add New Menu Item' : 'Edit Menu Item'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price <span className="text-red-500">*</span>
                </label>
                <Input
                  id="price"
                  name="price"
                  value={form.price}
                  onChange={handleFormChange}
                  required
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleFormChange}
                rows={3}
                placeholder="Item description (optional)"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">
                Image URL
              </label>
              <Input
                id="image"
                name="image"
                value={form.image}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg (optional)"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category <span className="text-red-500">*</span>
              </label>
              <Select name="category" value={form.category} onValueChange={(value) => setForm(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appetizers">Appetizers</SelectItem>
                  <SelectItem value="mainCourse">Main Course</SelectItem>
                  <SelectItem value="desserts">Desserts</SelectItem>
                  <SelectItem value="beverages">Beverages</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </DialogClose>
              <Button 
                type="submit"
                className="bg-[#684b2c] hover:bg-[#a77e58]"
              >
                {isNewItem ? 'Add Item' : 'Update Item'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
