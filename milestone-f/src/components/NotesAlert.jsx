export default function NotesAlert({message, isVisible, onClose, type = 'success'}) {
    if (!isVisible) return null;
    
    // Different colors and icons based on type
    const alertStyles = {
        success: {
            bg: 'bg-green-600',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            )
        },
        warning: {
            bg: 'bg-yellow-500',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            )
        },
        error: {
            bg: 'bg-red-600',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            )
        }
    };
    
    const currentStyle = alertStyles[type] || alertStyles.success;
    
    return (
        <>
            <style>{`
                @keyframes slideDownFade {
                    0% {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-30px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
                .alert-animate {
                    animation: slideDownFade 0.5s ease-out forwards;
                }
            `}</style>
            
            <div 
                className={`alert-animate fixed top-10 left-1/2 ${currentStyle.bg} text-white px-6 py-4 rounded-lg shadow-lg z-50`}
                style={{
                    transform: 'translateX(-50%)'
                }}
            >
                <div className="flex items-center gap-3">
                    {currentStyle.icon}
                    <p className="font-medium">{message}</p>
                </div>
            </div>
        </>
    )
}