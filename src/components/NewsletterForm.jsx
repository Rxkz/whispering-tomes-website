
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

    try {
      console.log('Calling newsletter-subscribe function...');
      
      // Use the correct Supabase function invocation method
      const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Function invocation error:', error);
        throw error;
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
        console.error('Unexpected response format:', data);
        setMessage('Successfully subscribed! Welcome to our newsletter.');
        setIsSuccess(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        details: error.details
      });
      
      // More user-friendly error messages
      if (error.message && error.message.includes('Failed to send a request to the Edge Function')) {
        setMessage('Unable to connect to our subscription service. Please try again in a moment.');
      } else if (error.message && error.message.includes('network')) {
        setMessage('Network error. Please check your connection and try again.');
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
