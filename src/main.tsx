import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import AdminPage from './components/AdminPage';
import { AppProvider } from './providers/AppProvider';
import './index.css';

// Route /admin to the AdminPage, everything else to the main App
const isAdminRoute = window.location.pathname === '/admin';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      {isAdminRoute ? <AdminPage /> : <App />}
    </AppProvider>
  </StrictMode>,
);
