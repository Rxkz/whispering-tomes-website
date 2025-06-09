import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [bookCount, setBookCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchBookCount = async () => {
      const { count, error } = await supabase.from('books').select('*', { count: 'exact', head: true });
      if (!error && typeof count === 'number') {
        setBookCount(count);
      }
    };
    fetchBookCount();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    let cover_image_url = '';
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
    const { title, author, description, price } = form;
    const { error } = await supabase.from('books').insert([
      {
        title,
        author,
        description,
        price: parseFloat(price),
        cover_image_url,
      },
    ]);
    setLoading(false);
    if (error) {
      setMessage('Error adding book: ' + error.message);
    } else {
      setMessage('Book added successfully!');
      setForm({ title: '', author: '', description: '', price: '' });
      setCoverFile(null);
      setCoverPreview(null);
      setShowModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
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
              <p className="text-2xl font-bold text-ivory">0</p>
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
              <p className="text-2xl font-bold text-ivory">0</p>
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
              <Button className="w-full bg-gold hover:bg-gold/90 text-navy">
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
              <div className="text-ivory/70 text-center py-8">
                No recent activity to display
              </div>
            </CardContent>
          </Card>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-navy p-8 rounded-lg shadow-lg w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-gold" onClick={() => setShowModal(false)}>&times;</button>
              <h2 className="text-2xl text-gold mb-4 font-cormorant">Add New Book</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-2 rounded bg-navy border border-gold/30 text-ivory" required />
                <input name="author" value={form.author} onChange={handleChange} placeholder="Author" className="w-full p-2 rounded bg-navy border border-gold/30 text-ivory" required />
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 rounded bg-navy border border-gold/30 text-ivory" required />
                <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" step="0.01" className="w-full p-2 rounded bg-navy border border-gold/30 text-ivory" required />
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 rounded bg-navy border border-gold/30 text-ivory" required />
                {coverPreview && <img src={coverPreview} alt="Preview" className="w-full h-48 object-contain mb-2 border border-gold/30" />}
                <span className="text-xs text-antique block mb-2">Upload a cover image (jpg, png, etc.).</span>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
