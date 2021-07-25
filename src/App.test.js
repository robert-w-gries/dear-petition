import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './components/App';

const mockWindowProperty = (property, value) => {
  const { [property]: originalProperty } = window;
  delete window[property];
  beforeAll(() => {
    Object.defineProperty(window, property, {
      configurable: true,
      writable: true,
      value,
    });
  });
  afterAll(() => {
    window[property] = originalProperty;
  });
};

describe('App behavior without user data', () => {
  mockWindowProperty('localStorage', {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
  });
  test('renders login page', () => {
    render(<App />);
    expect(screen.getByAltText('DEAR logo')).toBeInTheDocument();
    expect(screen.getByText('username')).toBeInTheDocument();
    expect(screen.getByText('password')).toBeInTheDocument();
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
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
    getItem: (key) => ({
      [key]: user,
    }),
    removeItem: jest.fn(),
  });

  test('renders home page', () => {
    render(<App />);
    expect(screen.getByText('Upload CIPRS Records')).toBeInTheDocument();
  });
});
