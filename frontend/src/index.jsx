import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider

// Make sure to import any global styles or fonts here
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// makeServer(); // Initialize your mock server if applicable

root.render(
  <React.StrictMode>
    <ThemeProvider> {/* Wrap App with ThemeProvider */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
