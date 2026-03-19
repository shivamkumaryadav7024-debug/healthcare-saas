import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { registerServiceWorker, requestNotificationPermission } from './utils/notifications'
import './index.css'

// Register service worker for notifications
registerServiceWorker();

// Request notification permission
requestNotificationPermission().catch(err => console.log('Notification permission:', err));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
