import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';
export const API_BASE_URL = rawApiUrl.endsWith('/api')
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/$/, '')}/api`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if token exists in localStorage on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedUser = localStorage.getItem('blogUser');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          // Verify with backend
          const res = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${parsed.token}`,
            },
          });
          
          if (res.ok) {
            const userData = await res.json();
            setUser({ ...userData, token: parsed.token });
          } else {
            // Token expired or invalid
            localStorage.removeItem('blogUser');
          }
        } catch (error) {
          console.error('Error verifying auth token:', error);
          localStorage.removeItem('blogUser');
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    setUser(data);
    localStorage.setItem('blogUser', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('blogUser');
  };

  const getAuthHeader = () => {
    return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
