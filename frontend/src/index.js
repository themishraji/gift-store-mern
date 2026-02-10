import React from 'react';
import ReactDOM from 'react-dom/client';
import AppIndex from './AppIndex';
import { AuthProvider } from './AuthContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppIndex />
    </AuthProvider>
  </React.StrictMode>
);