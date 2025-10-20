import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getNoteById, deleteNote } from '../../services/notesService';
import Header from '../../components/Header';
import NotesAlert from '../../components/NotesAlert';

export default function DeleteNotes() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get note ID from URL
    const [loading, setLoading] = useState(false);
    const [fetchingNote, setFetchingNote] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [note, setNote] = useState(null);

    // Fetch the note data when component mounts
    useEffect(() => {
        const fetchNote = async () => {
            try {
                setFetchingNote(true);
                console.log('Fetching note with ID:', id);
                const response = await getNoteById(id);
                console.log('Note fetched successfully:', response);
                
                if (response.data) {
                    setNote(response.data);
                }
            } catch (err) {
                console.error('Failed to fetch note:', err);
                setError('Failed to load note. Please try again.');
            } finally {
                setFetchingNote(false);
            }
        };

        if (id) {
            fetchNote();
        }
    }, [id]);

    // Delete function - no confirmation
    const handleDeleteClick = async () => {
        setLoading(true);
        setError(null);

        console.log('Deleting note with ID:', id);

        try {
            await deleteNote(id);
            console.log('Note deleted successfully');
            
            // Show delete success message (red)
            setShowDeleteAlert(true);
            
            // Redirect to dashboard after showing alert
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (err) {
            console.error('Failed to delete note:', err);
            
            // Show detailed error message only on error
            let errorMessage = 'Failed to delete note';
            
            if (err.status === 'NETWORK_ERROR') {
                errorMessage = 'Cannot connect to backend server. Make sure backend is running at http://localhost:4000';
            } else if (err.statusCode === 500 || err.status === 500) {
                errorMessage = 'Server Error (500): ' + (err.message || 'Internal server error');
            } else if (err.statusCode === 404 || err.status === 404) {
                errorMessage = 'Note not found (404). It may have already been deleted.';
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    // Show loading state while fetching note
    if (fetchingNote) {
        return (
            <div className="min-h-screen bg-light">
                <Header />
                <div className="px-6 sm:px-12 py-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <p className="text-gray-600">Loading note...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show error if note not found
    if (!note && !fetchingNote) {
        return (
            <div className="min-h-screen bg-light">
                <Header />
                <div className="px-6 sm:px-12 py-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 text-center">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Note Not Found</h1>
                            <p className="text-gray-600 mb-6">The note you're trying to delete doesn't exist.</p>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-hover-primary transition-colors font-medium"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light">
            {showDeleteAlert && (
                <NotesAlert 
                    message="Note deleted successfully!" 
                    type="error"
                    isVisible={true}
                    onClose={() => setShowDeleteAlert(false)}
                />
            )}
            
            <Header />

            <div className="px-6 sm:px-12 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back to Dashboard</span>
                    </button>

                    {/* Confirmation Card */}
                    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
                        <div className="text-center mb-6">
                            {/* Warning Icon */}
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Delete Note</h1>
                            <p className="text-gray-600">Are you sure you want to delete this note?</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm whitespace-pre-wrap">{error}</p>
                            </div>
                        )}

                        {/* Note Preview */}
                        {note && (
                            <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
                                <div className="flex items-start justify-between mb-3">
                                    <h2 className="text-xl font-semibold text-gray-900">{note.title}</h2>
                                    <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-3 py-1 rounded capitalize">
                                        {note.category}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm whitespace-pre-wrap">
                                    {note.content}
                                </p>
                                <div className="mt-4 text-xs text-gray-500">
                                    Created: {new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString()}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteClick}
                                disabled={loading}
                                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Deleting...' : 'Delete Note'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
