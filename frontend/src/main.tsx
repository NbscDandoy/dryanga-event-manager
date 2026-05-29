import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// 🍏 Global Application Styles - Look directly in the same folder
import "./Global.css"; // ✅ FIXED: Point directly to the file next to main.tsx

import  App  from './app/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);