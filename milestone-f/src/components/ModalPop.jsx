import { useEffect } from 'react';

export default function ModalPop({ message, isVisible, onClose }) {
    
    // Auto close after 3 seconds
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slide-in-right">
            <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="font-medium">{message}</p>
                <button 
                    onClick={onClose}
                    className="ml-4 text-white hover:text-gray-200 transition"
                >
                    ✕
                </button>
            </div>
        </div>
    )
}
