import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, BookOpen, ShoppingCart, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const { user, isLoading } = useAuth();

  console.log('AdminDashboard - user:', user);
  console.log('AdminDashboard - isLoading:', isLoading);

  // Temporarily remove all authentication checks to allow access to everyone
  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-gold">Loading...</div>
      </div>
    );
  }

  // Comment out the user check for now to allow everyone access
  // if (!user) {
  //   console.log('No user found, redirecting to auth');
  //   return <Navigate to="/auth" replace />;
  // }

  return (
    <div className="min-h-screen bg-navy pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-cormorant text-gold mb-2">Admin Dashboard</h1>
          <p className="text-ivory">Manage your E-Library system</p>
          {user && <p className="text-ivory/70 text-sm mt-2">Welcome, {user.email}</p>}
          {!user && <p className="text-ivory/70 text-sm mt-2">Demo Mode - No Authentication Required</p>}
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
              <p className="text-2xl font-bold text-ivory">0</p>
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
              <Button className="w-full bg-gold hover:bg-gold/90 text-navy">
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
      </div>
    </div>
  );
};

export default AdminDashboard;
