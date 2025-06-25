import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, BookOpen, ShoppingCart, Settings } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

const AdminDashboard = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    release_date: '',
    pages: '',
    format: 'Hardcover, E-book',
  });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [bookCount, setBookCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfName, setPdfName] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [showOrders, setShowOrders] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  // Move count fetchers outside useEffect for reuse
  const fetchBookCount = async () => {
    const { count, error } = await supabase.from('books').select('*', { count: 'exact', head: true });
    if (!error && typeof count === 'number') {
      setBookCount(count);
    }
  };
  const fetchUserCount = async () => {
    // Use profiles table for user count
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    if (!error && typeof count === 'number') {
      setUserCount(count);
    }
  };
  const fetchOrderCount = async () => {
    const { count, error } = await supabase.from('orders').select('*', { count: 'exact', head: true });
    if (!error && typeof count === 'number') {
      setOrderCount(count);
    }
  };

  const fetchRecentActivity = async () => {
    setActivityLoading(true);
    // Use the custom database function to get joined activity data
    const { data, error } = await supabase.rpc('get_recent_activity');

    if (!error && data) {
      // Map the flat data from the RPC to the nested structure the component expects
      const formattedData = data.map(activity => ({
        id: activity.order_id,
        created_at: activity.created_at,
        status: activity.status,
        profiles: { username: activity.username },
        books: { title: activity.book_title }
      }));
      setRecentActivity(formattedData);
    } else if (error) {
      console.error('Error fetching recent activity via RPC:', error.message);
      setRecentActivity([]); // Clear activity on error
    }
    setActivityLoading(false);
  };

  useEffect(() => {
    fetchBookCount();
    fetchUserCount();
    fetchOrderCount();
    fetchRecentActivity();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    } else {
      setCoverFile(null);
      setCoverPreview(null);
      alert('Please select a valid image file.');
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPdfName(file.name);
    } else {
      setPdfFile(null);
      setPdfName('');
      alert('Please select a valid PDF file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    let cover_image_url = '';
    let ebook = '';
    // Upload cover image
    if (coverFile) {
      const fileExt = coverFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage.from('img').upload(fileName, coverFile, { cacheControl: '3600', upsert: false });
      if (uploadError) {
        setLoading(false);
        setMessage('Error uploading image: ' + uploadError.message);
        return;
      }
      cover_image_url = `${supabase.storage.from('img').getPublicUrl(fileName).data.publicUrl}`;
    } else {
      setLoading(false);
      setMessage('Please select a cover image.');
      return;
    }
    // Upload PDF
    if (pdfFile) {
      const fileExt = pdfFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const { data, error: pdfError } = await supabase.storage.from('ebook').upload(fileName, pdfFile, { cacheControl: '3600', upsert: false });
      if (pdfError) {
        setLoading(false);
        setMessage('Error uploading PDF: ' + pdfError.message);
        return;
      }
      ebook = fileName;
    } else {
      setLoading(false);
      setMessage('Please select a PDF file.');
      return;
    }
    const { title, author, description, price, release_date, pages, format } = form;
    const { error } = await supabase.from('books').insert([
      {
        title,
        author,
        description,
        price: parseFloat(price),
        cover_image_url,
        ebook,
        release_date,
        pages: pages ? parseInt(pages) : null,
        format,
      },
    ]);
    setLoading(false);
    if (error) {
      setMessage('Error adding book: ' + error.message);
    } else {
      setMessage('Book added successfully!');
      setForm({ title: '', author: '', description: '', price: '', release_date: '', pages: '', format: 'Hardcover, E-book' });
      setCoverFile(null);
      setCoverPreview(null);
      setPdfFile(null);
      setPdfName('');
      setShowModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
      fetchBookCount(); // update book count after adding
      fetchOrderCount(); // in case adding a book triggers an order
      fetchRecentActivity(); // update activity
    }
  };

  // Fetch orders from Supabase
  const handleViewOrders = async () => {
    setShowOrders(true);
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      // Revert: fetch only from orders, no join
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
      fetchOrderCount(); // update order count after viewing orders
      fetchRecentActivity(); // update activity
    } catch (err) {
      setOrdersError('Failed to fetch orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-gold">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-navy pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-cormorant text-gold mb-2">Admin Dashboard</h1>
          <p className="text-ivory">Manage your E-Library system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-navy/50 border-gold/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-gold flex items-center gap-2">
                <Users size={20} />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-ivory">{userCount}</p>
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
              <p className="text-2xl font-bold text-ivory">{bookCount}</p>
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
              <p className="text-2xl font-bold text-ivory">{orderCount}</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-navy/50 border-gold/30">
            <CardHeader>
              <CardTitle className="text-gold">Quick Actions</CardTitle>
              <CardDescription className="text-ivory/70">
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-gold hover:bg-gold/90 text-navy" onClick={() => setShowModal(true)}>
                Add New Book
              </Button>
              <Button className="w-full bg-gold hover:bg-gold/90 text-navy">
                Manage Users
              </Button>
              <Button className="w-full bg-gold hover:bg-gold/90 text-navy" onClick={handleViewOrders}>
                View Orders
              </Button>
              <Button className="w-full bg-gold hover:bg-gold/90 text-navy">
                System Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-navy/50 border-gold/30">
            <CardHeader>
              <CardTitle className="text-gold">Recent Activity</CardTitle>
              <CardDescription className="text-ivory/70">
                Latest system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <div className="text-sm text-center text-gray-500 py-8">Loading...</div>
              ) : recentActivity.length > 0 ? (
                <ul className="space-y-4">
                  {recentActivity.map((activity) => (
                    <li key={activity.id} className="grid grid-cols-3 items-center gap-4 text-sm">
                      <div className="text-left">
                        <p className="font-medium text-white">
                          New Order from {activity.profiles?.username || 'Unknown User'}
                        </p>
                        <p className="text-gray-400">
                          Book: {activity.books?.title || 'Unknown Book'}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        {activity.status && (
                          ['delivered', 'paid'].includes(activity.status.toLowerCase()) ? (
                            <span className="px-3 py-1 text-xs font-bold text-green-900 bg-green-300 rounded-full">
                              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                            </span>
                          ) : (
                            <span className="px-3 py-1 text-xs font-bold text-red-900 bg-red-300 rounded-full">
                              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                            </span>
                          )
                        )}
                      </div>

                      <time className="text-right text-xs text-gray-500">
                        {new Date(activity.created_at).toLocaleString()}
                      </time>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-center text-gray-500 py-8">
                  No recent activity to display
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-navy p-8 rounded-lg shadow-lg w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
              <button className="absolute top-2 right-2 text-gold" onClick={() => setShowModal(false)}>&times;</button>
              <h2 className="text-2xl text-gold mb-4 font-cormorant">Add New Book</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-2 rounded bg-navy border border-gold/30 text-ivory" required />
                  <input name="author" value={form.author} onChange={handleChange} placeholder="Author" className="w-full p-2 rounded bg-navy border border-gold/30 text-ivory" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" step="0.01" className="w-full p-2 rounded bg-navy border border-gold/30 text-ivory" required />
                  <input name="pages" value={form.pages} onChange={handleChange} placeholder="Pages" type="number" className="w-full p-2 rounded bg-navy border border-gold/30 text-ivory" required />
                  <input name="release_date" value={form.release_date} onChange={handleChange} placeholder="Release Date" type="date" className="w-full p-2 rounded bg-navy border border-gold/30 text-ivory" required />
                </div>
                <input name="format" value={form.format} onChange={handleChange} placeholder="Format (e.g. Hardcover, E-book)" className="w-full p-2 rounded bg-navy border border-gold/30 text-ivory" required />
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 rounded bg-navy border border-gold/30 text-ivory" required />
                <div>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 rounded bg-navy border border-gold/30 text-ivory" required />
                  {coverPreview && <img src={coverPreview} alt="Preview" className="w-full h-48 object-contain mb-2 border border-gold/30" />}
                  <span className="text-xs text-antique block mb-2">Upload a cover image (jpg, png, etc.).</span>
                </div>
                <div>
                  <input type="file" accept="application/pdf" onChange={handlePdfChange} className="w-full p-2 rounded bg-navy border border-gold/30 text-ivory" required />
                  {pdfName && <div className="text-xs text-gold mb-2">Selected PDF: {pdfName}</div>}
                  <span className="text-xs text-antique block mb-2">Upload the book PDF (only .pdf allowed).</span>
                </div>
                <button type="submit" className="w-full bg-gold text-navy py-2 rounded hover:bg-gold/90" disabled={loading}>{loading ? 'Adding...' : 'Add Book'}</button>
                {message && <div className="text-center text-gold mt-2">{message}</div>}
              </form>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-navy border border-gold px-8 py-5 rounded shadow-lg text-gold font-cormorant text-lg animate-fade-in">
              Book added!
            </div>
          </div>
        )}

        {/* Orders Modal */}
        {showOrders && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-navy p-8 rounded-lg shadow-lg w-full max-w-4xl relative overflow-y-auto max-h-[90vh]">
              <button className="absolute top-2 right-2 text-gold" onClick={() => setShowOrders(false)}>&times;</button>
              <h2 className="text-2xl text-gold mb-4 font-cormorant">Orders</h2>
              {ordersLoading ? (
                <div className="text-gold">Loading orders...</div>
              ) : ordersError ? (
                <div className="text-red-500">{ordersError}</div>
              ) : orders.length === 0 ? (
                <div className="text-ivory/70">No orders found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gold/20 rounded text-ivory">
                    <thead>
                      <tr className="bg-navy/80 text-gold">
                        <th className="px-4 py-2 border-b border-gold/20 border-r border-gold/20">Order ID</th>
                        <th className="px-4 py-2 border-b border-gold/20 border-r border-gold/20">User ID</th>
                        <th className="px-4 py-2 border-b border-gold/20 border-r border-gold/20">Book ID</th>
                        <th className="px-4 py-2 border-b border-gold/20 border-r border-gold/20">Status</th>
                        <th className="px-4 py-2 border-b border-gold/20 border-r border-gold/20">Total Amount</th>
                        <th className="px-4 py-2 border-b border-gold/20">Stripe Session ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id} className="border-b border-gold/10 hover:bg-navy/60">
                          <td className="px-4 py-2 border-r border-gold/20">{order.id}</td>
                          <td className="px-4 py-2 border-r border-gold/20">{order.user_id}</td>
                          <td className="px-4 py-2 border-r border-gold/20">{order.book_id}</td>
                          <td className="px-4 py-2 border-r border-gold/20">{order.status}</td>
                          <td className="px-4 py-2 border-r border-gold/20">${order.total_amount}</td>
                          <td className="px-4 py-2 text-xs break-all">{order.stripe_session_id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 