import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedUser = localStorage.getItem('travelPlanner_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('travelPlanner_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    try {
      // For demo purposes, create a user object
      const userData = {
        email,
        name: email.split('@')[0], // Simple name generation for demo
        token: 'email_password_token'
      };
      
      // Store user data
      setUser(userData);
      localStorage.setItem('travelPlanner_user', JSON.stringify(userData));
      
      console.log('User signed in with email:', userData);
      return userData;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('travelPlanner_user');
  };

  const value = {
    user,
    loading,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 