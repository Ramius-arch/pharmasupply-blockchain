import React, { createContext, useState, useEffect } from 'react';
import authService from '../api/authService'; // Import the authService
// import { useLocalStorage } from '../utils/localStorage'; // Custom hook for localStorage access
// import { useNavigate } from 'react-router-dom'; // For protected route navigation

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  // const navigate = useNavigate(); // Use navigate for React Router v6

  // Load user from localStorage on component mount
  useEffect(() => {
    console.log('AuthContext: Loading user from localStorage...');
    const storedUser = JSON.parse(localStorage.getItem('user')) || null;
    if (storedUser) {
      setUser(storedUser);
      console.log('AuthContext: User loaded from localStorage:', storedUser);
    } else {
      console.log('AuthContext: No user found in localStorage.');
    }
    setLoading(false); // Set loading to false when data is loaded
  }, []);

  // Function to handle login
  const login = async (email, password) => { // Accept email and password as separate arguments
    try {
      const response = await authService.login({ email, password }); // Construct credentials object
      console.log('AuthContext: Login successful, data from API:', response);
      // Process the login response and update state
      // The backend now returns { message, ...user_details, token }
      setUser(response);
      localStorage.setItem('user', JSON.stringify(response)); // Store user in localStorage
      console.log('AuthContext: User state updated and saved to localStorage.');
      return true; // Indicate successful login
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error; // Re-throw to be handled by parent component
    }
  };

  // Function to handle registration
  const register = async (userData) => {
    try {
      const response = await authService.register(userData); // Use authService
      console.log('AuthContext: Registration successful, data from API:', response);
      // Process the registration response and update state
      // The backend now returns { message, ...user_details, token }
      setUser(response);
      localStorage.setItem('user', JSON.stringify(response)); // Store user in localStorage
      console.log('AuthContext: User state updated and saved to localStorage.');
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
      throw error; // Re-throw to be handled by parent component
    }
  };

  // Function to handle logout
  const logout = () => {
    console.log('AuthContext: Logging out user...');
    setUser(null);
    localStorage.removeItem('user');
    console.log('AuthContext: User state cleared from context and localStorage.');
    // navigate('/login'); // Redirect to login page after logout
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;
  console.log('AuthContext: Current user:', user, 'isAuthenticated:', isAuthenticated, 'loading:', loading);

  // Return the context value
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
