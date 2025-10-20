import { useState } from 'react';
import Header from '../components/Header';
import AllNotes from '../components/AllNotes';


export default function Dashboard() {
    // Force re-render of AllNotes when dashboard loads
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <div className="min-h-screen bg-white">
            
            {/* Header */}
            <Header />
            

            {/* All Notes Component - key forces refresh */}
            <AllNotes key={refreshKey} />
           
        </div>
    )
}