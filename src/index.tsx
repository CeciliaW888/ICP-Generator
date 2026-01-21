import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  // This should be caught by window.onerror in index.html, but just in case
  const errorMsg = "Fatal Error: Could not find root element to mount to";
  document.body.innerHTML = `<div style="color:red; padding:20px;">${errorMsg}</div>`;
  throw new Error(errorMsg);
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("React Mount Error:", error);
  // We can let the global error handler in index.html pick this up
  throw error;
}