import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

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

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef();
    useEffect(() => {
        const handleClickOutside = (e) => {
          if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsOpen(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
            <div className="max-w-[1920px] mx-auto py-2 px-2 sm:px-10 lg:px-10 xl:px-16 xl:py-4 2xl:px-24">
                <div className="flex justify-between items-center">
                    {/* Left - Logo/Brand */}
                    <div className="flex items-center">
                        {/* User Profile */}
                        <Link to="/dashboard">
                            <div className="flex items-center gap-1 sm:gap-1">
                                <img src="public/assets/logo-notes.png" alt="logo" className="w-8 h-8 rounded-full hover:shadow-md transition-all duration-200" />
                                <p className='text-md font-semibold'>Personal Notes</p>
                            </div>
                        </Link>
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        {/* Profile Icon */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center gap-3 sm:gap-4 focus:outline-none"
                        >
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-7 h-7 text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            >
                            {/* Head */}
                            <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                            {/* Body */}
                            <path
                                d="M5.5 21c0-3 5-4 6.5-4s6.5 1 6.5 4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        </button>

                        {/* Dropdown */}
                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white shadow-lg rounded-xl border border-gray-200 py-3 px-4 z-50 animate-fadeIn">
                        
                            {/* User Info */}
                            <div className="mb-3">
                                <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                            </div>

                            {/* My Notes */}
                            <Link to="/dashboard">
                                <button className="flex items-center gap-2 px-2 w-full text-left mb-2 text-gray-700 hover:bg-gray-100 
                                rounded-md py-1 text-sm transition-colors duration-150">
                                    <img path="/dashboard" src="public/assets/logo-notes.png" 
                                    alt="logo" className="w-5 h-5 rounded-full hover:shadow-md transition-all duration-200" />
                                My Notes
                                </button>
                            </Link>

                        {/* Profile */}
                        <Link to="/edit-profie">
                            <button className="flex items-center px-2 gap-2 w-full text-left mb-2 text-gray-700 hover:bg-gray-100 
                                rounded-md py-1 text-sm transition-colors duration-150">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 text-black"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M5.5 21c0-3 5-4 6.5-4s6.5 1 6.5 4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                                Profile
                            </button>
                        </Link>

                        {/* Logout */}
                        <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left text-sm text-red-600 
                        hover:bg-red-50 rounded-md px-2 py-1 transition-colors duration-150"
                        >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        Logout
                        </button>
                    </div>
                    )}

                    </div>
                </div>
            </div>
        </header>
    )
}