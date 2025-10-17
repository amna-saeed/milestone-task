import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    // Check if user is authenticated by checking for token in localStorage
    const token = localStorage.getItem('token');
    
    // If no token found, redirect to login page
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    // If token exists, render the protected component
    return children;
}

