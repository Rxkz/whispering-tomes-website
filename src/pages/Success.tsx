import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy text-gold p-8">
      <h1 className="text-4xl font-cormorant font-bold mb-6">Thank you for your purchase!</h1>
      <p className="text-lg text-ivory mb-8 text-center max-w-xl">
        Your payment was successful. You will receive an email with your download link soon.<br/>
        If you have any issues, please contact support.
      </p>
      <button
        className="gold-btn px-8 py-3 text-lg font-cormorant rounded"
        onClick={() => navigate('/')}
      >
        Go to Home
      </button>
    </div>
  );
};

export default Success; 