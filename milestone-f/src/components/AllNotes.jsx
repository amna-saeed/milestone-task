import { useState } from 'react';

export default function AllNotes() {
    // Sample notes data (replace with API call later)
    const [notes, setNotes] = useState([
        {
            id: 1,
            title: 'Daily Task',
            content: 'Complete the project documentation and review code',
            category: 'Work',
            date: '2024-01-20'
        },
        {
            id: 2,
            title: 'Meeting Notes',
            content: 'Discuss new features with the team',
            category: 'Work',
            date: '2024-01-21'
        },
        {
            id: 3,
            title: 'Shopping List',
            content: 'Buy groceries and household items',
            category: 'Personal',
            date: '2024-01-22'
        },
        {
            id: 4,
            title: 'Shopping List',
            content: 'Buy groceries and household items',
            category: 'Personal',
            date: '2024-01-22'
        }
    ]);

    const [editingNote, setEditingNote] = useState(null);

    // Handle Edit
    const handleEdit = (note) => {
        setEditingNote(note);
        // You can open a modal or navigate to edit page here
        console.log('Edit note:', note);
    };

    // Handle Delete
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            setNotes(notes.filter(note => note.id !== id));
            console.log('Deleted note with id:', id);
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
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Notes</h1>
                <p className="text-gray-600 mt-1">Manage your notes</p>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-center mx-auto max-w-6xl">
                {notes.map((note) => (
                    <div 
                        key={note.id} 
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                    >
                        {/* Note Header with Category Badge */}
                        <div className="bg-gradient-to-r from-primary to-blue-500 p-4">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-semibold text-white bg-white bg-opacity-20 px-2 py-1 rounded">
                                    {note.category}
                                </span>
                                <span className="text-xs text-white opacity-80">
                                    {note.date}
                                </span>
                            </div>
                        </div>

                        {/* Note Content */}
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                                {note.title}
                            </h2>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {note.content}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                                {/* Edit Button */}
                                <button
                                    onClick={() => handleEdit(note)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 group"
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

                                {/* View/Open Button */}
                                <button
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200 group"
                                    title="View"
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
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                                        />
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                </div>
                ))}
            </div>

            {/* Empty State */}
            {notes.length === 0 && (
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
                    <p className="text-gray-500 text-lg">No notes yet</p>
                    <p className="text-gray-400 text-sm">Create your first note to get started</p>
                </div>
            )}
        </div>
    )
}