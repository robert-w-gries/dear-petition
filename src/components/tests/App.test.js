import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

import mockWindowProperty from './windowProperty.mock';

describe('App behavior without user data', () => {
  mockWindowProperty('localStorage', {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
  });
  test('renders login page', () => {
    render(<App />);
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(window.location.pathname === '/login').toBe(true);
  });
});

describe('App behavior with user data', () => {
  const user = {
    pk: 1,
    username: 'myuser',
    password: 'mypass',
    admin_url: '',
  };
  mockWindowProperty('localStorage', {
    setItem: jest.fn(),
    getItem: (key) => (key === 'user' ? user : jest.fn()),
    removeItem: jest.fn(),
  });

  test('renders home page', () => {
    render(<App />);
    expect(screen.getByText('Upload CIPRS Records')).toBeInTheDocument();
    expect(window.location.pathname === '/').toBe(true);
  });
});
