import {BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from '../pages/authPages/RegisterPage';
import LoginPage from '../pages/authPages/LoginPage';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import AuthRoute from '../components/AuthRoute';
import EditProfile from '../pages/authPages/EditProfile'

// Notes
import CreateNotes from '../pages/notesCard/CreateNotes';
import EditNotes from '../pages/notesCard/EditNotes';
import DeleteNotes from '../pages/notesCard/DeleteNotes';

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                {/* default route*/}
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/register" element={
                    <AuthRoute>
                        <RegisterPage />
                    </AuthRoute>
                } />
                <Route path="/login" element={
                    <AuthRoute>
                        <LoginPage />
                    </AuthRoute>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/edit-profie" element={ <EditProfile /> } />

                {/* Notes Routes */}
                <Route path="/notes/create" element={
                    <ProtectedRoute>
                        <CreateNotes />
                    </ProtectedRoute>
                } />

                {/* Edit Notes */}
                <Route path="/notes/edit/:id" element={
                    <ProtectedRoute>
                        <EditNotes />
                    </ProtectedRoute>
                } />

                {/* Delete Notes */}
                <Route path="/notes/delete/:id" element={
                    <ProtectedRoute>
                        <DeleteNotes />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    )
}