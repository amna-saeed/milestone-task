import Header from '../components/Header';
import AllNotes from '../components/AllNotes';
import SearchBox from '../components/SearchBox';


export default function Dashboard() {
    return (
        <div className="min-h-screen bg-light">
            
            {/* Header */}
            <Header />
            
            {/* Search Box */}
            <SearchBox />

            {/* All Notes Component */}
            <AllNotes />
           
        </div>
    )
}