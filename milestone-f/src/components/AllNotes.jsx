import { useState } from 'react';

export default function AllNotes() {
    // Sample notes data (replace with API call later)
    // Define 3 different color schemes
    const colorSchemes = [
        { header: 'bg-[#DECCFF]', border: 'border-blue-200' },
        { header: 'bg-[#FFDBCC]', border: 'border-purple-200' },
        { header: 'bg-[#F4F8D2]', border: 'border-pink-200' }
    ];

    const [notes, setNotes] = useState([
        {
            id: 1,
            title: 'Daily Task',
            content: 'Complete the project documentation and review code. Make sure all tests pass and update the README file with new features.',
            category: 'Work',
            date: '2024-01-20',
            colorScheme: colorSchemes[0]
        },
        {
            id: 2,
            title: 'Meeting Notes',
            content: 'Discuss new features with the team. Review the sprint progress and plan for next week deliverables.',
            category: 'Work',
            date: '2024-01-21',
            colorScheme: colorSchemes[1]
        },
        {
            id: 3,
            title: 'Shopping List',
            content: 'Buy groceries and household items. Don\'t forget milk, bread, eggs, and cleaning supplies.',
            category: 'Personal',
            date: '2024-01-22',
            colorScheme: colorSchemes[2]
        },
        {
            id: 4,
            title: 'Project Ideas',
            content: 'Research new project ideas for next quarter. Focus on AI and machine learning applications.',
            category: 'Work',
            date: '2024-01-23',
            colorScheme: colorSchemes[0]
        },
        {
            id: 5,
            title: 'Team Meeting',
            content: 'Discuss quarterly goals and assign tasks to team members. Review last sprint performance.',
            category: 'Meetings',
            date: '2024-01-24',
            colorScheme: colorSchemes[1]
        },
        {
            id: 6,
            title: 'Client Call Notes',
            content: 'Important points from client meeting: Budget approval, timeline extension, new requirements added.',
            category: 'Meetings',
            date: '2024-01-25',
            colorScheme: colorSchemes[2]
        }
    ]);

    const [editingNote, setEditingNote] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Filter notes based on selected category
    const filteredNotes = selectedCategory === 'All' 
        ? notes 
        : notes.filter(note => note.category === selectedCategory);

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
        <div className="px-12 py-6">
            <div className="max-w-7xl mx-auto">
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Notes</h1>
                        <p className="text-gray-600 mt-1">Manage your notes</p>
                    </div>

                    {/* Category Dropdown Filter */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Category
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="block w-full sm:w-48 px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 cursor-pointer"
                        >
                            <option value="All">All Categories</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Meetings">Meetings</option>
                            <option value="Important">Important</option>
                        </select>
                        {/* Dropdown Icon */}
                        <div className="absolute right-3 top-10 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes Grid */}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredNotes.map((note, index) => (
                    <div 
                        key={note.id}
                    >
                        {/* Inner Note Card */}
                        <div className="bg-white rounded-[25px] overflow-hidden min-h-[280px] flex flex-col h-full">
                            {/* Note Header with Category Badge */}
                            <div className={`${note.colorScheme?.header || colorSchemes[index % 3].header} p-5`}>
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-semibold text-black bg-white bg-opacity-20 px-2 py-1 rounded">
                                    {note.category}
                                </span>
                                <span className="text-xs font-bold text-black opacity-80">
                                    {note.date}
                                </span>
                            </div>
                        </div>

                        {/* Note Content */}
                        <div className="p-5 flex-grow flex flex-col">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                                {note.title}
                            </h2>
                            <p className="text-gray-600 text-sm mb-4 flex-grow leading-relaxed">
                                {note.content}
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
            </div>
           

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
                        {selectedCategory === 'All' ? 'No notes yet' : `No ${selectedCategory} notes found`}
                    </p>
                    <p className="text-gray-400 text-sm">
                        {selectedCategory === 'All' ? 'Create your first note to get started' : 'Try selecting a different category'}
                    </p>
                </div>
            )}
            </div>
        </div>
    )
}