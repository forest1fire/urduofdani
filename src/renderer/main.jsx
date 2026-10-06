import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/components.css';
import './styles/responsive.css';
import './styles/editor.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);