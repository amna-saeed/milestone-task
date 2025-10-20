import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllNotes, deleteNote, updateNote } from '../services/notesService';
import NotesAlert from './NotesAlert';

export default function AllNotes() {
    const navigate = useNavigate();
    
    const [notes, setNotes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Delete confirmation states
    const [deleteNoteId, setDeleteNoteId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    
    // View modal states
    const [viewNote, setViewNote] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [isEditingInModal, setIsEditingInModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        title: '',
        content: '',
        category: 'work'
    });

    const fetchNotes = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching notes from API...');
            const response = await getAllNotes();
            console.log('API Response:', response);
            
            // Normalize and set notes from API response
            const notesFromApi = Array.isArray(response)
                ? response
                : Array.isArray(response?.notes)
                ? response.notes
                : [];
            setNotes(notesFromApi);
            
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

    const filteredNotes = notes.filter(note => {
        // Category filter
        const matchesCategory =
          selectedCategory === 'All' ||
          note.category?.toLowerCase() === selectedCategory.toLowerCase();
      
        // Search filter
        const searchLower = searchQuery.toLowerCase().trim();
        const matchesSearch =
          searchQuery.trim() === '' ||
          note.title?.toLowerCase().includes(searchLower) ||
          note.content?.toLowerCase().includes(searchLower) ||
          note.category?.toLowerCase().includes(searchLower);
      
        return matchesCategory && matchesSearch;
      });
      

    // Handle Edit
    const handleEdit = (note) => {
        console.log('Navigating to edit note:', note.id);
        navigate(`/notes/edit/${note.id}`);
    };

    // Handle Delete - Navigate to delete page
    const handleDeleteClick = (noteId) => {
        console.log('Show delete confirmation for note:', noteId);
        setDeleteNoteId(noteId);
    };

    const confirmDelete = async (noteId) => {
        try {
            setDeleting(true);
            setError(null);
            console.log('Deleting note with ID:', noteId);
            
            await deleteNote(noteId);
            
            setDeleteNoteId(null);
            setShowDeleteAlert(true);
            
            // Remove the deleted note from the list
            setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
            
            // Hide alert after 1.5 seconds
            setTimeout(() => {
                setShowDeleteAlert(false);
            }, 1500);
        } catch (err) {
            console.error('Delete error:', err);
            setError(err.message || 'Failed to delete note');
            setDeleteNoteId(null);
        } finally {
            setDeleting(false);
        }
    };

    const cancelDelete = () => {
        setDeleteNoteId(null);
    };

    // Handle View Note
    const handleViewNote = (note) => {
        console.log('Viewing note:', note);
        setViewNote(note);
        setEditFormData({
            title: note.title,
            content: note.content,
            category: note.category
        });
        setShowViewModal(true);
        setIsEditingInModal(false);
    };

    const closeViewModal = () => {
        setShowViewModal(false);
        setViewNote(null);
        setIsEditingInModal(false);
    };

    const toggleEditMode = () => {
        if (!isEditingInModal && viewNote) {
            setEditFormData({
                title: viewNote.title,
                content: viewNote.content,
                category: viewNote.category
            });
        }
        setIsEditingInModal(!isEditingInModal);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const saveEditInModal = async () => {
        if (!editFormData.title.trim() || !editFormData.content.trim()) {
            setError('Title and content are required');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            await updateNote(viewNote.id, editFormData);
            
            // Update the note in the list
            setNotes(prevNotes => prevNotes.map(note => 
                note.id === viewNote.id 
                    ? { ...note, ...editFormData, updatedAt: new Date().toISOString() }
                    : note
            ));
            
            // Update viewNote with new data
            setViewNote(prev => ({ ...prev, ...editFormData, updatedAt: new Date().toISOString() }));
            
            setIsEditingInModal(false);
            setLoading(false);
        } catch (err) {
            console.error('Update error:', err);
            setError(err.message || 'Failed to update note');
            setLoading(false);
        }
    };

    const cancelEditInModal = () => {
        setEditFormData({
            title: viewNote.title,
            content: viewNote.content,
            category: viewNote.category
        });
        setIsEditingInModal(false);
        setError(null);
    };

    // Handle Update (Save after edit)
    const handleUpdate = (updatedNote) => {
        setNotes(notes.map(note => 
            note.id === updatedNote.id ? updatedNote : note
        ));
        console.log('Updated note:', updatedNote);
    };

    return (
        <div className="px-[25px] py-4 sm:px-6 sm:py-4 lg:px-12 lg:py-6 xl:px-16 2xl:px-24">
            {/* Delete Success Alert */}
            {showDeleteAlert && (
                <NotesAlert 
                    message="Note deleted successfully!" 
                    type="error"
                    isVisible={true}
                    onClose={() => setShowDeleteAlert(false)}
                />
            )}

            {/* View Note Modal */}
            {showViewModal && viewNote && (
                <div className="fixed inset-0 bg-[#2c2c2cd6] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-lg border border-[#625e5e] 
                    max-w-md w-full mx-4 overflow-y-auto animate-fadeIn">
                    
                        {/* Modal Header */}
                        <div className="p-5 border-b border-gray-100 rounded-t-2xl bg-gray-50/60">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    
                                    {/* Category */}
                                    {isEditingInModal ? (
                                    <select
                                        name="category"
                                        value={editFormData.category}
                                        onChange={handleEditChange}
                                        className="bg-[#e2e2e2] text-xs font-semibold px-2.5 py-1 rounded-full mb-2 border border-gray-300 bg-white
                                        focus:outline-none focus:ring-0 focus:border-transparent active:border-transparent
                                        "
                                    >
                                        <option value="work">Work</option>
                                        <option value="personal">Personal</option>
                                        <option value="meetings">Meetings</option>
                                    </select>
                                    ) : (
                                    <span className="bg-[#d3d2d2] text-xs font-semibold text-black bg-white bg-opacity-30 px-3 py-1 rounded-full">
                                        {capitalizeCategory(viewNote.category)}
                                    </span>
                                    )}

                                    {/* Editable Title */}
                                    {isEditingInModal ? (
                                    <input
                                        type="text"
                                        name="title"
                                        value={editFormData.title}
                                        onChange={handleEditChange}
                                        maxLength={50}
                                        className="w-full text-lg font-semibold text-gray-900 mt-2 break-words border border-gray-300 rounded px-2 py-1"
                                        placeholder="Note title"
                                    />
                                    ) : (
                                    <h2
                                        className="text-lg font-semibold text-gray-900 mt-2 break-words cursor-text"
                                        onClick={() => setIsEditingInModal(true)}
                                    >
                                        {viewNote.title}
                                    </h2>
                                    )}
                                </div>

                                {/* Close Button */}
                                
                                <button
                                    onClick={closeViewModal}
                                    className="ml-3 p-1.5 hover:bg-white hover:bg-opacity-30 rounded-full transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Date and Time */}
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-900">
                                <div className="flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-medium">{formatTime(viewNote.updatedAt || viewNote.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium">{formatDate(viewNote.updatedAt || viewNote.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Content</h3>
                            {isEditingInModal ? (
                            <textarea
                                name="content"
                                value={editFormData.content}
                                onChange={handleEditChange}
                                maxLength={500}
                                rows="8"
                                className="w-full text-gray-700 leading-relaxed break-words text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-200"
                                placeholder="Note content"
                            />
                            ) : (
                            <p
                                className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words text-sm cursor-text"
                                onClick={() => setIsEditingInModal(true)}
                            >
                                {viewNote.content}
                            </p>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="px-4 pb-2">
                            <p className="text-red-600 text-xs">{error}</p>
                            </div>
                        )}

                        {/* Modal Footer */}
                        <div className="border-t border-gray-200 p-3 flex justify-end gap-2 bg-gray-50 rounded-b-2xl">
                            {isEditingInModal ? (
                            <>
                            
                                <button
                                onClick={saveEditInModal}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                                >
                                {loading ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                onClick={cancelEditInModal}
                                disabled={loading}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium disabled:opacity-50"
                                >
                                Cancel
                                </button>
                            </>
                            ) : (
                                <div className="flex items-center">
                                   <button
                                        onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(note);
                                    }}
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

                                    <button
                                        onClick={() => {
                                        closeViewModal();
                                        handleDeleteClick(viewNote.id);
                                        }}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
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
                            )}
                        </div>
                    </div>
                </div>
            )}



            <div className="max-w-[1920px] mx-auto">
                <div className="mb-5 w-full">
                    <div className="flex justify-between items-center flex-wrap gap-3">

                        {/* Left Side — Title + Total Notes */}
                        <div className="flex flex-col">
                            <h1 className="text-lg sm:text-2xl font-bold text-gray-800">All Notes</h1>
                            {/* Total Notes */}
                            <p className="text-gray-500 text-sm sm:text-base mt-0 sm:mt-1">
                                Total Notes: {notes.length}
                            </p>
                        </div>

                        {/* Right Side — Create Note Button */}
                        <button
                            onClick={() => navigate('/notes/create')}
                            className="flex items-center justify-center gap-1 bg-[#184071] text-white 
                            px-2 lg:px-3 py-2 lg:py-[7px] rounded-lg text-sm sm:text-[15px] lg:text-[14px]
                            hover:bg-[#184071] transition-colors font-medium shadow-sm"
                          >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>New Note</span>
                        </button>

                    </div>
                </div>


                {/* serach */}
                {/* Right side - Search and Category in one line */}
                <div className="w-full mb-1">
                    {/* Search Box */}
                    <div className="w-full relative">
                        <input
                            type="text"
                            placeholder="Enter Search Task, Category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-2 py-3 sm:pr-3 sm:py-3 border border-[#a4a4a4] rounded-lg bg-white
                            focus:outline-none focus:ring-1 focus:ring-[rgb(238,238,238)] 
                            transition-colors duration-200 text-sm text-gray-800 placeholder-gray-400"
                        />
                        <svg
                            className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
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
                   
                </div>

                {/* Category Dropdown Filter */}
                <div className="w-full flex flex-col sm:flex-row sm:items-center gap-2 mt-4">
                    <p className="flex items-center text-sm font-medium text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 text-[#283152]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L14 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 018 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                        </svg>
                        Filter by tags:
                    </p>
                    <div className='grid grid-cols-2 sm:flex flex-wrap items-center gap-2'>
                        {['All', 'Work', 'Personal', 'Meetings'].map((category) => (
                            <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`rounded-[42px] text-[12px] sm:text py-[2px] px-[21px] font-medium border transition-all duration-200 
                                ${
                                  selectedCategory === category
                                    ? 'bg-[#184071] text-white border-[#184071]'
                                    : 'bg-white text-[#283152] border-[#283152] hover:bg-[#dceafc]'
                                }`}
                            >
                            {category}
                            </button>
                        ))}
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
                <div style={{ paddingTop: '30px' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                    {filteredNotes.map((note, index) => (
                        <div 
                            key={note.id}
                            className="relative"
                        >
                            {/* Inner Note Card */}
                            <div 
                                onClick={() => handleViewNote(note)}
                                className="bg-white h-[190px] rounded-[11px] border border-[#c9c9c9] overflow-hidden 
                                flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                            >
                        {/* Note Header with Category Badge, Time and Date */}
                                
                             {/* Note Content */}
                            <div className="py-3 px-4 flex-grow flex flex-col overflow-hidden">
                                <div className="flex justify-between items-start gap-3">
                                    <h2 className="text-md mb-1 font-medium text-gray-900">
                                        {note.title}
                                    </h2>
                                    <span className="text-xs font-semibold text-black bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                                        {capitalizeCategory(note.category)}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 flex-grow leading-relaxed break-words overflow-wrap-anywhere">
                                    {truncateContent(note.content, 80)}
                                </p>
                                <div className="w-full">
                                    <div className="flex justify-between items-start">
                                        {/* Left Side - Category */}
                                        <span className="text-xs font-medium text-gray-700">
                                            {formatDate(note.updatedAt || note.createdAt)}
                                        </span>
                                        {/* Right Side - Date & Time */}
                                        <div className="flex flex-col items-end space-y-0.5">
                                            <span className="text-xs font-medium text-gray-700">
                                                {formatTime(note.updatedAt || note.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-end pt-1 mt-auto border-t border-gray-100">
                                    {/* Edit Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(note);
                                        }}
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(note.id);
                                        }}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 group"
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

                            {/* Small Delete Confirmation Overlay */}
                            {deleteNoteId === note.id && (
                                <div 
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute inset-0 bg-white bg-opacity-95 rounded-[25px] flex items-center justify-center p-4 animate-fadeIn"
                                >
                                    <div className="text-center">
                                        <p className="text-gray-800 font-medium mb-4 text-sm">Delete this note?</p>
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    cancelDelete();
                                                }}
                                                disabled={deleting}
                                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    confirmDelete(note.id);
                                                }}
                                                disabled={deleting}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
                                            >
                                                {deleting ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
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
    );
}