import React from 'react';
import { Container, createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App';
import store from './store';
import { Provider } from 'react-redux';

const renderElement = (
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);

const container = document.getElementById('root') as Container;
const root = createRoot(container);
root.render(renderElement);
