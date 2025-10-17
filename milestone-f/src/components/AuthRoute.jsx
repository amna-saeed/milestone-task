import { Navigate } from 'react-router-dom';

export default function AuthRoute({ children }) {
    // Check if user is already authenticated
    const token = localStorage.getItem('token');
    
    // If token exists, redirect to dashboard (user is already logged in)
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }
    
    // If no token, render the auth page (login/register)
    return children;
}

