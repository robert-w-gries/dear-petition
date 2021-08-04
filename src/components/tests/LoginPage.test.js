import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginPage from '../pages/LoginPage/LoginPage';

describe('App behavior with user data', () => {
  test('renders all elements', async () => {
    render(<LoginPage />);
    expect(screen.getByAltText('DEAR logo')).toBeInTheDocument();
    expect(screen.getByText('username')).toBeInTheDocument();
    expect(screen.getByText('password')).toBeInTheDocument();
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });
});
