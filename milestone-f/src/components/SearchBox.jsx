export default function SearchBox({ onSearch }) {
    return (
        <div className="px-12 py-4">
            <div className="max-w-7xl mx-auto">
                <div className="relative w-full sm:w-80">
                    <input
                        type="text"
                        placeholder="Search notes..."
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 text-sm"
                    />
                    <svg
                        className="absolute left-3 top-3 w-5 h-5 text-gray-400"
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
        </div>
    )
}
