import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          axios.defaults.headers.common['x-auth-token'] = token;
          const res = await axios.get('/api/auth');
          setCurrentUser(res.data);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      const res = await axios.post('/api/auth/register', userData);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      
      // Get user data
      const userRes = await axios.get('/api/auth');
      setCurrentUser(userRes.data);
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setError(null);
      const res = await axios.post('/api/auth/login', userData);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      
      // Get user data
      const userRes = await axios.get('/api/auth');
      setCurrentUser(userRes.data);
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setCurrentUser(null);
    navigate('/login');
  };

  // Connect TikTok account
  const connectTikTok = async (tiktokData) => {
    try {
      setError(null);
      await axios.post('/api/users/connect-tiktok', tiktokData);
      
      // Update user data
      const userRes = await axios.get('/api/auth');
      setCurrentUser(userRes.data);
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect TikTok account');
      return false;
    }
  };

  // Disconnect TikTok account
  const disconnectTikTok = async () => {
    try {
      setError(null);
      await axios.post('/api/users/disconnect-tiktok');
      
      // Update user data
      const userRes = await axios.get('/api/auth');
      setCurrentUser(userRes.data);
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to disconnect TikTok account');
      return false;
    }
  };

  // Update user preferences
  const updatePreferences = async (preferences) => {
    try {
      setError(null);
      const res = await axios.put('/api/users/preferences', preferences);
      
      // Update user data
      const userRes = await axios.get('/api/auth');
      setCurrentUser(userRes.data);
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update preferences');
      return false;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    connectTikTok,
    disconnectTikTok,
    updatePreferences
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
