import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNote } from '../../services/notesService';
import Header from '../../components/Header';

export default function CreateNotes() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({
        title: false,
        content: false
    });
    
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'work'  // Backend expects lowercase
    });

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

        // Log the data being sent
        console.log('Creating note with data:', formData);

        try {
            const response = await createNote(formData);
            console.log('Note created successfully:', response);
            
            // Show success message
            alert('Note created successfully!');
            
            // Redirect to dashboard after successful creation
            navigate('/dashboard');
        } catch (err) {
            // Check if note was actually created despite the error
            console.log('Checking if note was created despite error...');
            
            // If it's a 500 error but note might be created, show different message
            if (err.statusCode === 500 || err.status === 500) {
                console.warn('500 error received. Note might have been created. Check backend logs.');
            }
            console.error('Failed to create note:', err);
            console.error('Error details:', {
                message: err.message,
                status: err.status,
                statusCode: err.statusCode,
                errors: err.errors,
                fullError: err
            });
            
            // Show detailed error message
            let errorMessage = 'Failed to create note';
            
            if (err.status === 'NETWORK_ERROR') {
                errorMessage = 'Cannot connect to backend server. Make sure backend is running at http://localhost:4000';
            } else if (err.statusCode === 500 || err.status === 500) {
                // Backend server error
                errorMessage = 'Server Error (500): ';
                if (err.message) {
                    errorMessage += err.message;
                }
                
                // Show backend error details if available
                if (err.error) {
                    errorMessage += '\n\nBackend Error: ' + err.error;
                }
                if (err.details) {
                    errorMessage += '\nError Type: ' + err.details;
                }
                
                errorMessage += '\n\n IMPORTANT: The note might have been created anyway!';
                errorMessage += '\nGo back to dashboard and click "Refresh" to check.';
                errorMessage += '\n\nCheck backend console for detailed error logs.';
            } else if (err.statusCode === 400 || err.status === 400) {
                // Backend validation error
                errorMessage = 'Bad Request (400): ';
                if (err.message) {
                    errorMessage += err.message;
                }
                if (err.errors && Array.isArray(err.errors)) {
                    errorMessage += '\n' + err.errors.map(e => e.message || e).join('\n');
                }
                if (err.error) {
                    errorMessage += '\n' + err.error;
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
            {/* Header */}
            <Header />

            <div className="px-6 sm:px-12 py-8">
                <div className="max-w-3xl mx-auto">
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

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Create New Note</h1>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm whitespace-pre-wrap">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title <span className="text-red-500">*</span>
                                    <span className="text-gray-500 text-xs ml-2">
                                        ({formData.title.length}/50 characters)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    maxLength={50}
                                    placeholder="Enter note title (max 50 characters)"
                                    style={fieldErrors.title ? { border: '1px solid #ef4444' } : {}}
                                    className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-colors resize-none ${
                                        fieldErrors.content 
                                        ? 'focus:ring-1 focus:ring-red-500 focus:border-red-300' 
                                        : 'border border-gray-300 focus:ring-1 focus:ring-gray-200 focus:border-gray-200'
                                    }`}
                                />
                                {fieldErrors.title && (
                                    <p className="text-red-500 text-sm mt-1">
                                        Title is required
                                    </p>
                                )}
                                {formData.title.length >= 50 && !fieldErrors.title && (
                                    <p className="text-orange-600 text-sm mt-1">
                                        ⚠️ Maximum 50 characters reached
                                    </p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200 transition-colors cursor-pointer"
                                >
                                    <option value="work">Work</option>
                                    <option value="personal">Personal</option>
                                    <option value="meetings">Meetings</option>
                                </select>
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Content <span className="text-red-500">*</span>
                                    <span className="text-gray-500 text-xs ml-2">
                                        ({formData.content.length}/500 characters)
                                    </span>
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    maxLength={500}
                                    placeholder="Write your note content here (max 500 characters)..."
                                    rows="8"
                                    style={fieldErrors.content ? { border: '1px solid #ef4444' } : {}}
                                    className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-colors resize-none ${
                                        fieldErrors.content 
                                        ? 'focus:ring-1 focus:ring-red-500 focus:border-red-300' 
                                        : 'border border-gray-300 focus:ring-1 focus:ring-gray-200 focus:border-gray-200'
                                    }`}
                                ></textarea>
                                {fieldErrors.content && (
                                    <p className="text-red-500 text-sm mt-1">
                                        Content is required
                                    </p>
                                )}
                                {formData.content.length >= 500 && !fieldErrors.content && (
                                    <p className="text-orange-600 text-sm mt-1">
                                        ⚠️ Maximum 500 characters reached
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-hover-primary transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating...' : 'Create Note'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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
