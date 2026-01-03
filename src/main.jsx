import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Montage de l'application avec le StrictMode pour garantir la qualité du code
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);