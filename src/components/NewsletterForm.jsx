
import React, { useState } from 'react';
import { supabase } from '../integrations/supabase/client';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    console.log('Newsletter subscription attempt for:', email);
    console.log('Current URL:', window.location.href);
    console.log('Supabase client URL:', supabase.supabaseUrl);

    try {
      console.log('Calling newsletter-subscribe function...');
      
      // Use the correct Supabase function invocation method with proper body format
      const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: { email },
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Function invocation error:', error);
        // Handle specific error types
        if (error.message && error.message.includes('FunctionsHttpError')) {
          setMessage('Service temporarily unavailable. Please try again in a moment.');
        } else if (error.message && error.message.includes('CORS')) {
          setMessage('Connection issue detected. Please refresh the page and try again.');
        } else {
          setMessage('Unable to process subscription. Please try again.');
        }
        setIsSuccess(false);
        return;
      }

      if (data && data.error) {
        console.error('Function returned error:', data.error);
        setMessage(data.error);
        setIsSuccess(false);
      } else if (data && data.success) {
        console.log('Success:', data.message);
        setMessage(data.message);
        setIsSuccess(true);
        setEmail('');
      } else {
        console.log('Subscription successful');
        setMessage('Successfully subscribed! Welcome to our newsletter.');
        setIsSuccess(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        details: error.details,
        name: error.name,
        stack: error.stack
      });
      
      // More user-friendly error messages based on error type
      if (error.name === 'FunctionsHttpError') {
        setMessage('Our subscription service is currently unavailable. Please try again in a few minutes.');
      } else if (error.message && error.message.includes('network')) {
        setMessage('Network error. Please check your connection and try again.');
      } else if (error.message && error.message.includes('CORS')) {
        setMessage('Connection issue detected. Please refresh the page and try again.');
      } else if (error.message && error.message.includes('Failed to send a request')) {
        setMessage('Service connection failed. Please try refreshing the page.');
      } else {
        setMessage('Something went wrong. Please try again later.');
      }
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input 
        type="email" 
        placeholder="Your email address" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="bg-navy/50 border border-gold/30 rounded px-4 py-3 text-ivory focus:outline-none focus:border-gold flex-grow max-w-md"
        aria-label="Email for newsletter"
        disabled={isLoading}
      />
      <button 
        type="submit" 
        className="gold-btn disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Subscribing...' : 'Subscribe'}
      </button>
      {message && (
        <div className={`mt-2 text-sm ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </div>
      )}
    </form>
  );
};

export default NewsletterForm;
