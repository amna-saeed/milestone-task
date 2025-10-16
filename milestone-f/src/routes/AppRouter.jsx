import {BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from '../pages/authPages/RegisterPage';
import LoginPage from '../pages/authPages/LoginPage';


export default function AppRouter() {
    return (
        <Router>
            <Routes>
                {/* default route*/}
                <Route path="/" element={<Navigate to="/register" replace />} />

                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </Router>
    )
}