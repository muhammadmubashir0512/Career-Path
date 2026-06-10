import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Loading state - spinner dikhao
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f1729]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E94560] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Agar user nahi hai to login pe bhejo
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Agar user hai to children (requested page) dikhao
  return children;
};

export default ProtectedRoute;