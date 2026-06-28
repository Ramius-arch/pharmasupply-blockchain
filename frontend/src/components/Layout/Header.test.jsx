import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';
import { AuthContext } from '../../context/AuthContext';

const mockAuthContextValue = {
  user: null,
  isAuthenticated: false,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  loading: false,
};

const renderHeader = (authValue = mockAuthContextValue) =>
  render(
    <AuthContext.Provider value={authValue}>
      <Router>
        <Header onToggleSidebar={jest.fn()} />
      </Router>
    </AuthContext.Provider>
  );

describe('Header', () => {
  it('renders brand logo and authenticate link when not authenticated', () => {
    renderHeader();

    expect(screen.getByText('PharmaNet Ledger')).toBeInTheDocument();
    expect(screen.getByText(/Authenticate/i)).toBeInTheDocument();
    expect(screen.queryByText(/Exit Session/i)).not.toBeInTheDocument();
  });

  it('renders user name and logout when authenticated', () => {
    renderHeader({
      ...mockAuthContextValue,
      isAuthenticated: true,
      user: { role: 'user', firstName: 'Test' },
    });

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByTitle(/Exit Session/i)).toBeInTheDocument();
    expect(screen.queryByText(/Authenticate/i)).not.toBeInTheDocument();
  });

  it('calls logout function when logout button is clicked', () => {
    const logout = jest.fn();
    renderHeader({
      ...mockAuthContextValue,
      isAuthenticated: true,
      user: { role: 'user', firstName: 'Test' },
      logout,
    });

    screen.getByTitle(/Exit Session/i).click();
    expect(logout).toHaveBeenCalledTimes(1);
  });
});
