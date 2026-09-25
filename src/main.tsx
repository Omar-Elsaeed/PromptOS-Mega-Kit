import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerWebMcp } from './utils/webmcp.ts';

// Initialize WebMCP tools on page load for AI agents and browser extensions
registerWebMcp();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
