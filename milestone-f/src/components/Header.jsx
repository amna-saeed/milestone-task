import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login
        navigate('/login');
    };

    // Get first letter of name for avatar
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.charAt(0).toUpperCase();
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Left - Logo/Brand */}
                    <div className="flex items-center">
                        {/* User Profile */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Profile Icon */}
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-lg">
                                {getInitials(user?.fullName || user?.name)}
                            </div>
                            
                            {/* User Name */}
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.fullName || user?.name || 'User'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user?.email || ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right - User Profile & Logout */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Logout Button */}
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base transition-colors duration-200 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}