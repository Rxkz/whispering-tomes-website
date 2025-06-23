import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, fullName, username);
        toast({
          title: "Success!",
          description: "Account created successfully. You can now sign in.",
        });
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <div className="flex flex-1 items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6 bg-transparent p-8 rounded-lg"
        >
          <h2 className="text-center text-2xl font-cormorant text-gold mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-center text-antique/80 mb-6">
            {isSignUp
              ? 'Sign up to access your E-Library account'
              : 'Sign in to your E-Library account'}
          </p>
          {isSignUp && (
            <>
              <div>
                <label htmlFor="fullName" className="block text-antique mb-1">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full p-2 rounded bg-navy border border-gold/30 text-ivory"
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-antique mb-1">Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full p-2 rounded bg-navy border border-gold/30 text-ivory"
                />
              </div>
            </>
          )}
          <div>
            <label htmlFor="email" className="block text-antique mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 rounded bg-navy border border-gold/30 text-ivory"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-antique mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-2 rounded bg-navy border border-gold/30 text-ivory"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gold hover:bg-gold/90 text-navy font-semibold py-3 text-base rounded transition-colors duration-300"
            disabled={loading}
          >
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
          <div className="mt-2 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-gold hover:underline font-medium bg-transparent border-none"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
