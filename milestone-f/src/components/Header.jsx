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
        <header className="bg-light shadow-sm sticky top-0 z-40">
            <div className="bg-[#283152] max-w-7xl mx-auto py-4 px-6 sm:px-8 lg:px-10">
                <div className="flex justify-between items-center">
                    {/* Left - Logo/Brand */}
                    <div className="flex items-center">
                        {/* User Profile */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Profile Icon */}
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-light text-[#283152] flex items-center justify-center font-bold text-2xl">
                                {getInitials(user?.name)}
                            </div>
                            
                            {/* User Name */}
                            <div className="hidden sm:block">
                                <p className="font-semibold text-2xl text-light">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-light">
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
                            class="bg-light hover:bg-red-600 hover:text-white text-red-600 px-4 py-2 sm:px-4 sm:py-2 rounded-md 
                            text-sm sm:text-base text-semibold
                            transition-colors duration-200 flex items-center gap-1"
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