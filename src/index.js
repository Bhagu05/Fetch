import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/App.css'; // Adjust the path as needed
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Adjust the path as needed

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider> {/* Ensure AuthProvider wraps the App */}
            <App />
        </AuthProvider>
    </React.StrictMode>
);
