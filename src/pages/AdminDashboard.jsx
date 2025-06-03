
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Users, BookOpen, ShoppingCart, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../integrations/supabase/client';

const AdminDashboard = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalOrders: 0
  });
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddBook, setShowAddBook] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    cover_image_url: ''
  });

  console.log('AdminDashboard - user:', user);
  console.log('AdminDashboard - isAdmin:', isAdmin);
  console.log('AdminDashboard - isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-gold">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    console.log('Not authorized, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (user && isAdmin) {
      fetchStats();
      fetchBooks();
      fetchOrders();
    }
  }, [user, isAdmin]);

  const fetchStats = async () => {
    try {
      // Count users from profiles table
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Count books
      const { count: bookCount } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true });

      // Count orders
      const { count: orderCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: userCount || 0,
        totalBooks: bookCount || 0,
        totalOrders: orderCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        title: "Error",
        description: "Failed to fetch books",
        variant: "destructive",
      });
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          books (title, author)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookData = {
        ...bookForm,
        price: bookForm.price ? parseFloat(bookForm.price) : null
      };

      if (editingBook) {
        const { error } = await supabase
          .from('books')
          .update(bookData)
          .eq('id', editingBook.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Book updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('books')
          .insert([bookData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Book added successfully",
        });
      }

      setBookForm({
        title: '',
        author: '',
        description: '',
        price: '',
        cover_image_url: ''
      });
      setShowAddBook(false);
      setEditingBook(null);
      fetchBooks();
      fetchStats();
    } catch (error) {
      console.error('Error saving book:', error);
      toast({
        title: "Error",
        description: "Failed to save book",
        variant: "destructive",
      });
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      description: book.description || '',
      price: book.price ? book.price.toString() : '',
      cover_image_url: book.cover_image_url || ''
    });
    setShowAddBook(true);
  };

  const handleDeleteBook = async (bookId) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Book deleted successfully",
      });
      fetchBooks();
      fetchStats();
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      });
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-navy pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-cormorant text-gold mb-2">Admin Dashboard</h1>
          <p className="text-ivory">Manage your E-Library system</p>
          <p className="text-ivory/70 text-sm mt-2">Welcome, {user.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-navy/50 border-gold/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-gold flex items-center gap-2">
                <Users size={20} />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-ivory">{stats.totalUsers}</p>
              <p className="text-sm text-ivory/70">Total registered users</p>
            </CardContent>
          </Card>

          <Card className="bg-navy/50 border-gold/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-gold flex items-center gap-2">
                <BookOpen size={20} />
                Books
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-ivory">{stats.totalBooks}</p>
              <p className="text-sm text-ivory/70">Books in library</p>
            </CardContent>
          </Card>

          <Card className="bg-navy/50 border-gold/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-gold flex items-center gap-2">
                <ShoppingCart size={20} />
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-ivory">{stats.totalOrders}</p>
              <p className="text-sm text-ivory/70">Total orders</p>
            </CardContent>
          </Card>

          <Card className="bg-navy/50 border-gold/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-gold flex items-center gap-2">
                <Settings size={20} />
                System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-500">Active</p>
              <p className="text-sm text-ivory/70">System status</p>
            </CardContent>
          </Card>
        </div>

        {/* Books Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-navy/50 border-gold/30">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-gold">Books Management</CardTitle>
                <Button 
                  onClick={() => {
                    setShowAddBook(!showAddBook);
                    setEditingBook(null);
                    setBookForm({
                      title: '',
                      author: '',
                      description: '',
                      price: '',
                      cover_image_url: ''
                    });
                  }}
                  className="bg-gold hover:bg-gold/90 text-navy"
                >
                  <Plus size={16} />
                  Add Book
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddBook && (
                <form onSubmit={handleBookSubmit} className="space-y-4 mb-6">
                  <Input
                    placeholder="Book Title"
                    value={bookForm.title}
                    onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                    required
                    className="bg-navy/50 border-gold/30 text-ivory"
                  />
                  <Input
                    placeholder="Author"
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    required
                    className="bg-navy/50 border-gold/30 text-ivory"
                  />
                  <Textarea
                    placeholder="Description"
                    value={bookForm.description}
                    onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                    className="bg-navy/50 border-gold/30 text-ivory"
                  />
                  <Input
                    placeholder="Price"
                    type="number"
                    step="0.01"
                    value={bookForm.price}
                    onChange={(e) => setBookForm({ ...bookForm, price: e.target.value })}
                    className="bg-navy/50 border-gold/30 text-ivory"
                  />
                  <Input
                    placeholder="Cover Image URL"
                    value={bookForm.cover_image_url}
                    onChange={(e) => setBookForm({ ...bookForm, cover_image_url: e.target.value })}
                    className="bg-navy/50 border-gold/30 text-ivory"
                  />
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-gold hover:bg-gold/90 text-navy">
                      {editingBook ? 'Update Book' : 'Add Book'}
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => {
                        setShowAddBook(false);
                        setEditingBook(null);
                      }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {books.map((book) => (
                  <div key={book.id} className="flex justify-between items-center p-3 bg-navy/30 rounded">
                    <div>
                      <p className="text-ivory font-medium">{book.title}</p>
                      <p className="text-ivory/70 text-sm">{book.author}</p>
                      {book.price && <p className="text-gold text-sm">${book.price}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEditBook(book)}
                        className="bg-gold/20 hover:bg-gold/30 text-gold"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDeleteBook(book.id)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Orders Management */}
          <Card className="bg-navy/50 border-gold/30">
            <CardHeader>
              <CardTitle className="text-gold">Recent Orders</CardTitle>
              <CardDescription className="text-ivory/70">
                Latest customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div key={order.id} className="p-3 bg-navy/30 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-ivory font-medium">{order.books?.title}</p>
                          <p className="text-ivory/70 text-sm">by {order.books?.author}</p>
                          <p className="text-gold text-sm">${order.total_amount}</p>
                        </div>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="bg-navy/50 border border-gold/30 text-ivory text-xs rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <p className="text-ivory/50 text-xs mt-2">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-ivory/70 text-center py-8">
                    No orders to display
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
