import React, { createContext, useState, useEffect } from 'react';
import authService from '../api/authService';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')) || null;
    if (storedUser) {
      setUser(storedUser);
    }
    setInitialLoading(false);
  }, []);

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response);
      localStorage.setItem('user', JSON.stringify(response));
      return true;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (userData) => {
    setAuthLoading(true);
    try {
      const response = await authService.register(userData);
      setUser(response);
      localStorage.setItem('user', JSON.stringify(response));
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!user;
  const loading = initialLoading || authLoading;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
