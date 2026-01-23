import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

// Mock AuthContext values
const mockAuthContextValue = {
  user: null,
  isAuthenticated: false,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  loading: false,
};

describe('Header', () => {
  it('renders login and register links when not authenticated', () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <Router>
          <Header />
        </Router>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/products/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/cart/i)).not.toBeInTheDocument();
  });

  it('renders cart, my orders, and logout links when authenticated', () => {
    const authenticatedAuthContextValue = {
      ...mockAuthContextValue,
      isAuthenticated: true,
      user: { role: 'user', firstName: 'Test' },
    };

    render(
      <AuthContext.Provider value={authenticatedAuthContextValue}>
        <Router>
          <Header />
        </Router>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/products/i)).toBeInTheDocument();
    expect(screen.getByText(/cart/i)).toBeInTheDocument();
    expect(screen.getByText(/my orders/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
    expect(screen.queryByText(/login/i)).not.toBeInTheDocument();
  });

  it('renders Dashboard link for admin user when authenticated', () => {
    const adminAuthContextValue = {
      ...mockAuthContextValue,
      isAuthenticated: true,
      user: { role: 'admin', firstName: 'Admin' },
    };

    render(
      <AuthContext.Provider value={adminAuthContextValue}>
        <Router>
          <Header />
        </Router>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/my orders/i)).toBeInTheDocument();
  });

  it('renders Dashboard link for supplier user when authenticated', () => {
    const supplierAuthContextValue = {
      ...mockAuthContextValue,
      isAuthenticated: true,
      user: { role: 'supplier', firstName: 'Supplier' },
    };

    render(
      <AuthContext.Provider value={supplierAuthContextValue}>
        <Router>
          <Header />
        </Router>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/my orders/i)).toBeInTheDocument();
  });

  it('calls logout function when logout button is clicked', () => {
    const authenticatedAuthContextValue = {
      ...mockAuthContextValue,
      isAuthenticated: true,
      user: { role: 'user', firstName: 'Test' },
    };
    authenticatedAuthContextValue.logout.mockClear(); // Clear any previous calls

    render(
      <AuthContext.Provider value={authenticatedAuthContextValue}>
        <Router>
          <Header />
        </Router>
      </AuthContext.Provider>
    );

    screen.getByText(/logout/i).click();
    expect(authenticatedAuthContextValue.logout).toHaveBeenCalledTimes(1);
  });
});
