import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getNoteById, updateNote } from '../../services/notesService';
import Header from '../../components/Header';
import NotesAlert from '../../components/NotesAlert';

export default function EditNotes() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get note ID from URL
    const [loading, setLoading] = useState(false);
    const [fetchingNote, setFetchingNote] = useState(true);
    const [error, setError] = useState(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({
        title: false,
        content: false
    });
    
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'work'
    });

    // Fetch the note data when component mounts
    useEffect(() => {
        const fetchNote = async () => {
            try {
                setFetchingNote(true);
                setError(null); // Clear any previous errors
                console.log('Fetching note with ID:', id);
                const response = await getNoteById(id);
                console.log('Note fetched successfully:', response);
                
                // Pre-fill form with existing note data
                if (response.data) {
                    setFormData({
                        title: response.data.title || '',
                        content: response.data.content || '',
                        category: response.data.category || 'work'
                    });
                    // Ensure error is cleared on successful fetch
                    setError(null);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field when user starts typing
        if (value.trim()) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: false
            }));
            // Also clear general error message when user starts editing
            if (error) {
                setError(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate fields
        const errors = {
            title: !formData.title.trim(),
            content: !formData.content.trim()
        };
        
        setFieldErrors(errors);
        
        // If any field has error, don't submit
        if (errors.title || errors.content) {
            setError('Please fill in all required fields');
            return;
        }
        
        setLoading(true);
        setError(null);

        console.log('Updating note with ID:', id, 'Data:', formData);

        try {
            const response = await updateNote(id, formData);
            console.log('Note updated successfully:', response);
            
            // Show success message
            setShowSuccessAlert(true);
            
            // Redirect to dashboard after showing alert
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (err) {
            console.error('Failed to update note:', err);
            
            // Show detailed error message
            let errorMessage = 'Failed to update note';
            
            if (err.status === 'NETWORK_ERROR') {
                errorMessage = 'Cannot connect to backend server.';
            } else if (err.statusCode === 500 || err.status === 500) {
                errorMessage = 'Server Error (500): ';
                if (err.message) {
                    errorMessage += err.message;
                }
            } else if (err.statusCode === 400 || err.status === 400) {
                errorMessage = 'Bad Request (400): ';
                if (err.message) {
                    errorMessage += err.message;
                }
                if (err.errors && Array.isArray(err.errors)) {
                    errorMessage += '\n' + err.errors.map(e => e.message || e).join('\n');
                }
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-light">
            {showSuccessAlert && (
                <NotesAlert 
                    message="Note updated successfully!" 
                    type="success"
                    isVisible={true}
                    onClose={() => setShowSuccessAlert(false)}
                />
            )}
            
            <Header />

            <div className="px-4 sm:px-6 py-4 sm:py-6">
                <div className="max-w-2xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 mb-4 transition-colors text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back to Dashboard</span>
                    </button>

                    {/* Form Card */}
                    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Edit Note</h1>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-xs sm:text-sm whitespace-pre-wrap">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                    Title <span className="text-red-500">*</span>
                                    <span className="text-gray-500 text-xs ml-1">
                                        ({formData.title.length}/50)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    maxLength={50}
                                    placeholder="Enter note title"
                                    style={fieldErrors.title ? { border: '1px solid #ef4444' } : {}}
                                    className={`w-full px-3 py-2 text-sm rounded-lg focus:outline-none transition-colors resize-none ${
                                        fieldErrors.content 
                                        ? 'focus:ring-1 focus:ring-red-500 focus:border-red-300' 
                                        : 'border border-gray-300 focus:ring-1 focus:ring-gray-200 focus:border-gray-200'
                                    }`}
                                />
                                {fieldErrors.title && (
                                    <p className="text-red-500 text-xs mt-1">
                                        Title is required
                                    </p>
                                )}
                                {formData.title.length >= 50 && !fieldErrors.title && (
                                    <p className="text-orange-600 text-xs mt-1">
                                        ⚠️ Maximum 50 characters reached
                                    </p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200 transition-colors cursor-pointer"
                                >
                                    <option value="work">Work</option>
                                    <option value="personal">Personal</option>
                                    <option value="meetings">Meetings</option>
                                </select>
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                                    Content <span className="text-red-500">*</span>
                                    <span className="text-gray-500 text-xs ml-1">
                                        ({formData.content.length}/500)
                                    </span>
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    maxLength={500}
                                    placeholder="Write your note content here..."
                                    rows="6"
                                    style={fieldErrors.content ? { border: '1px solid #ef4444' } : {}}
                                    className={`w-full px-3 py-2 text-sm rounded-lg focus:outline-none transition-colors resize-none ${
                                        fieldErrors.content 
                                        ? 'focus:ring-1 focus:ring-red-500 focus:border-red-300' 
                                        : 'border border-gray-300 focus:ring-1 focus:ring-gray-200 focus:border-gray-200'
                                    }`}
                                ></textarea>
                                {fieldErrors.content && (
                                    <p className="text-red-500 text-xs mt-1">
                                        Content is required
                                    </p>
                                )}
                                {formData.content.length >= 500 && !fieldErrors.content && (
                                    <p className="text-orange-600 text-xs mt-1">
                                        ⚠️ Maximum 500 characters reached
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 sm:gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-hover-primary transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Updating...' : 'Update Note'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
