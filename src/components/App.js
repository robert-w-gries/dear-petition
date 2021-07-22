import React, { useEffect } from 'react';
import AppStyled from './App.styled';
import GlobalStyle from '../styles/GlobalStyle';

// Routing
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ProtectedRoute from './containers/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage/HomePage';
import GenerationPage from './pages/GenerationPage/GenerationPage';
import FAQPage from './pages/HelpPage/HelpPage';
import LoginPage from './pages/LoginPage/LoginPage';
import { CSRF_TOKEN_LS_KEY, USER } from '../constants/authConstants';

function App() {
  useEffect(() => {
    // avoid local storage now we're using redux and properly using cookies
    if (localStorage.getItem(CSRF_TOKEN_LS_KEY)) {
      localStorage.removeItem(CSRF_TOKEN_LS_KEY);
    }
    if (localStorage.getItem(USER)) {
      localStorage.removeItem(USER);
    }
  }, []);

  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <AppStyled>
          <Switch>
            <Route path="/login">
              <LoginPage />
            </Route>
            <ProtectedRoute exact path="/">
              <HomePage />
            </ProtectedRoute>
            <ProtectedRoute exact path="/generate/:batchId">
              <GenerationPage />
            </ProtectedRoute>
            <ProtectedRoute exact path="/help">
              <FAQPage />
            </ProtectedRoute>
          </Switch>
        </AppStyled>
      </BrowserRouter>
    </>
  );
}

export default App;
