import {BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from '../pages/authPages/RegisterPage';
import LoginPage from '../pages/authPages/LoginPage';
import Dashboard from '../pages/Dashboard';


export default function AppRouter() {
    return (
        <Router>
            <Routes>
                {/* default route*/}
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    )
}