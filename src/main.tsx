import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// 🍏 Global Application Styles
import "../Global.css";
import App from './app/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);