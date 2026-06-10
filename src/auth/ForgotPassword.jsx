import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-hot-toast';

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
      toast.success('Reset link sent to your email!');
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email');
      } else {
        toast.error(error.message || 'Failed to send reset email');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#111111] border-2 border-[#E94560]/40 rounded-2xl max-w-md w-full p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-white text-2xl font-bold">Forgot Password</h2>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white text-3xl cursor-pointer leading-none transition-colors"
        >
          ×
        </button>
      </div>

      {!isSent ? (
        <>
          {/* Description */}
          <p className="text-white/60 text-base mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {/* Email Input */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-white/70 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full px-4 py-3 bg-black/60 border border-[#E94560]/30 rounded-xl text-white text-base focus:outline-none focus:border-[#E94560] transition-all"
                autoFocus
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#E94560] hover:bg-[#d43d5a] cursor-pointer text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border-2 border-[#E94560]/30 text-white/70 cursor-pointer font-semibold py-3 rounded-xl hover:bg-white/5 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          {/* Success State */}
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-green-500/20 cursor-pointer rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-white text-xl font-bold mb-2">Check Your Email</h3>
            
            <p className="text-white/60 text-base mb-6">
              We've sent a password reset link to<br />
              <span className="text-[#E94560] font-medium">{email}</span>
            </p>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full bg-[#E94560] hover:bg-[#d43d5a] cursor-pointer text-white font-semibold py-3 rounded-xl transition-all duration-200"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;