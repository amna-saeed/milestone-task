import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllNotes, deleteNote } from '../services/notesService';

export default function AllNotes() {
    const navigate = useNavigate();
    
    // Define 4 different color schemes
    const colorSchemes = [
        { header: 'bg-[#bcd7e0]' },
        { header: 'bg-[#baaec6]' },
        { header: 'bg-[#e8c9ad]' },
        { header: 'bg-[#b9d8c7]'}
    ];

    const [notes, setNotes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching notes from API...');
            const response = await getAllNotes();
            console.log('API Response:', response);
            
            // Add color scheme to each note based on index
            const notesWithColors = response.notes.map((note, index) => ({
                ...note,
                colorScheme: colorSchemes[index % 4]
            }));
            
            console.log('Notes with colors:', notesWithColors);
            setNotes(notesWithColors);
        } catch (err) {
            console.error('Failed to fetch notes:', err);
            setError(err.message || 'Failed to load notes');
        } finally {
            setLoading(false);
        }
    };

    // Fetch notes from API on component mount ONLY ONCE
    useEffect(() => {
        fetchNotes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array - runs only once

    // Helper function to capitalize category names for display
    const capitalizeCategory = (category) => {
        if (!category) return '';
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    // Helper function to format time
    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Helper function to truncate content to 90 characters (3 lines of ~30 chars each)
    const truncateContent = (content, maxLength = 90) => {
        if (!content) return '';
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    // Filter notes based on selected category and search query
    const filteredNotes = notes.filter(note => {
        // Category filter - if "All" is selected, show all categories
        const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
        
        // Search filter (search in title, content, AND category)
        const searchLower = searchQuery.toLowerCase().trim();
        const matchesSearch = searchQuery.trim() === '' || 
            (note.title && note.title.toLowerCase().includes(searchLower)) ||
            (note.content && note.content.toLowerCase().includes(searchLower)) ||
            (note.category && note.category.toLowerCase().includes(searchLower));
        
        // Both conditions must be true
        return matchesCategory && matchesSearch;
    });

    // Handle Edit
    const handleEdit = (note) => {
        console.log('Navigating to edit note:', note.id);
        navigate(`/notes/edit/${note.id}`);
    };

    // Handle Delete
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await deleteNote(id);
                // Remove note from state after successful deletion
                setNotes(notes.filter(note => note.id !== id));
                console.log('Deleted note with id:', id);
            } catch (err) {
                console.error('Failed to delete note:', err);
                alert(err.message || 'Failed to delete note');
            }
        }
    };

    // Handle Update (Save after edit)
    const handleUpdate = (updatedNote) => {
        setNotes(notes.map(note => 
            note.id === updatedNote.id ? updatedNote : note
        ));
        setEditingNote(null);
        console.log('Updated note:', updatedNote);
    };

    return (
        <div className="px-12 py-6">
            <div className="max-w-7xl mx-auto">
            {/* Top section with buttons and search - 20px margin bottom */}
            <div style={{ marginBottom: '20px' }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Left side - Create Note Button */}
                    <button
                        onClick={() => navigate('/notes/create')}
                        className="flex items-center justify-center gap-2 bg-[#283152] text-white px-3 py-2.5 rounded-lg 
                        hover:bg-[#283152e3] transition-colors font-medium shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Create Note</span>
                    </button>

                    {/* Right side - Search and Category in one line */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        {/* Search Box */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Enter Search Task, Category..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-3 border border-[#283152] rounded-lg bg-[#283152]
                                focus:outline-none focus:ring-1 focus:ring-[#283152] focus:border-[#283152] 
                                transition-colors duration-200 text-sm text-light"
                            />
                            <svg
                                className="absolute left-3 top-3 w-5 h-5 text-light"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>

                        {/* Category Dropdown Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full sm:w-48 px-4 py-2.5 text-sm font-medium text-[#283152] bg-white 
                            border-2 border-[#283152] rounded-lg shadow-sm hover:border-[#283152] focus:outline-none 
                            focus:ring-1 transition-colors duration-200 cursor-pointer"
                        >
                            <option value="All">All Categories</option>
                            <option value="work">Work</option>
                            <option value="personal">Personal</option>
                            <option value="meetings">Meetings</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading notes...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-600">{error}</p>
                    <button 
                        onClick={fetchNotes}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* Notes Grid */}
            {!loading && !error && (
            <div style={{ paddingTop: '20px' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredNotes.map((note, index) => (
                    <div 
                        key={note.id}
                    >
                        {/* Inner Note Card */}
                        <div className="bg-white rounded-[25px] overflow-hidden min-h-[280px] flex flex-col h-full">
                            {/* Note Header with Category Badge, Time and Date */}
                            <div className={`${note.colorScheme?.header || colorSchemes[index % 4].header} p-5`}>
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-semibold text-black bg-white bg-opacity-20 px-3 py-2 rounded">
                                    {capitalizeCategory(note.category)}
                                </span>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-xs font-bold text-black opacity-80">
                                        {formatTime(note.createdAt)}
                                    </span>
                                    <span className="text-xs font-medium text-black opacity-70">
                                        {formatDate(note.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Note Content */}
                        <div className="p-5 flex-grow flex flex-col overflow-hidden">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 break-words overflow-wrap-anywhere">
                                {note.title}
                            </h2>
                            <p className="text-gray-600 text-sm mb-4 flex-grow leading-relaxed break-words overflow-wrap-anywhere">
                                {truncateContent(note.content, 90)}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end pt-4 mt-auto border-t border-gray-100">
                                {/* Edit Button */}
                                <button
                                    onClick={() => handleEdit(note)}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 group"
                                    title="Edit"
                                >
                                    <svg 
                                        className="w-5 h-5" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                                        />
                                    </svg>
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDelete(note.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 group"
                                    title="Delete"
                                >
                                    <svg 
                                        className="w-5 h-5" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
                ))}

                {/* Empty State */}
                {filteredNotes.length === 0 && (
                <div className="text-center py-12">
                    <svg 
                        className="w-16 h-16 text-gray-400 mx-auto mb-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                        />
                    </svg>
                    <p className="text-gray-500 text-lg">
                        {searchQuery 
                            ? `No notes found for "${searchQuery}"` 
                            : selectedCategory === 'All' 
                            ? 'No notes yet' 
                            : `No ${capitalizeCategory(selectedCategory)} notes found`
                        }
                    </p>
                    <p className="text-gray-400 text-sm">
                        {searchQuery 
                            ? 'Try a different search term' 
                            : selectedCategory === 'All' 
                            ? 'Create your first note to get started' 
                            : 'Try selecting a different category'
                        }
                    </p>
                </div>
                )}
            </div>
            )}
            </div>
        </div>
    )
}