import axiosInstance from "../api/axiosInstance";

// Get all notes
export const getAllNotes = async () => {
    try {
        const response = await axiosInstance.get('/notes');
        return response.data;
    } catch (error) {
        console.log("Get notes error:", error);
        if (!error.response) {
            throw {
                message: "Cannot connect to backend server",
                status: 'NETWORK_ERROR'
            };
        }
        const errorData = error.response.data || { message: "Failed to fetch notes" };
        errorData.status = error.response.status;
        throw errorData;
    }
};

// Get a single note by ID
export const getNoteById = async (noteId) => {
    try {
        const response = await axiosInstance.get(`/notes/${noteId}`);
        return response.data;
    } catch (error) {
        console.log("Get note by ID error:", error);
        if (!error.response) {
            throw {
                message: "Cannot connect to backend server",
                status: 'NETWORK_ERROR'
            };
        }
        const errorData = error.response.data || { message: "Failed to fetch note" };
        errorData.status = error.response.status;
        throw errorData;
    }
};

// Create a new note
export const createNote = async (noteData) => {
    try {
        console.log('=== CREATE NOTE API CALL ===');
        console.log('Sending POST request to /notes with data:', noteData);
        console.log('Full URL:', 'http://localhost:4000/api/notes');
        
        const response = await axiosInstance.post('/notes', noteData);
        
        console.log('=== SUCCESS RESPONSE ===');
        console.log('Status:', response.status);
        console.log('Response data:', response.data);
        console.log('Response headers:', response.headers);
        
        return response.data;
    } catch (error) {
        console.error("=== CREATE NOTE ERROR ===");
        console.error("Error object:", error);
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error code:", error.code);
        console.error("Error response:", error.response);
        console.error("Error response data:", error.response?.data);
        console.error("Error response status:", error.response?.status);
        console.error("Error response headers:", error.response?.headers);
        console.error("Error config:", error.config);
        
        if (!error.response) {
            throw {
                message: "Cannot connect to backend server. Make sure backend is running at http://localhost:4000",
                status: 'NETWORK_ERROR'
            };
        }
        
        // Get detailed error from backend
        const errorData = error.response.data || { message: "Failed to create note" };
        errorData.status = error.response.status;
        errorData.statusCode = error.response.status;
        
        // Log full error details for debugging
        console.error("=== THROWING ERROR DATA ===");
        console.error("Full error data:", errorData);
        
        throw errorData;
    }
};

// Update a note
export const updateNote = async (noteId, noteData) => {
    try {
        const response = await axiosInstance.put(`/notes/${noteId}`, noteData);
        return response.data;
    } catch (error) {
        console.log("Update note error:", error);
        if (!error.response) {
            throw {
                message: "Cannot connect to backend server",
                status: 'NETWORK_ERROR'
            };
        }
        const errorData = error.response.data || { message: "Failed to update note" };
        errorData.status = error.response.status;
        throw errorData;
    }
};

// Delete a note
export const deleteNote = async (noteId) => {
    try {
        const response = await axiosInstance.delete(`/notes/${noteId}`);
        return response.data;
    } catch (error) {
        console.log("Delete note error:", error);
        if (!error.response) {
            throw {
                message: "Cannot connect to backend server",
                status: 'NETWORK_ERROR'
            };
        }
        const errorData = error.response.data || { message: "Failed to delete note" };
        errorData.status = error.response.status;
        throw errorData;
    }
};

// Search notes
export const searchNotes = async (query) => {
    try {
        const response = await axiosInstance.get(`/notes/search?q=${query}`);
        return response.data;
    } catch (error) {
        console.log("Search notes error:", error);
        if (!error.response) {
            throw {
                message: "Cannot connect to backend server",
                status: 'NETWORK_ERROR'
            };
        }
        const errorData = error.response.data || { message: "Failed to search notes" };
        errorData.status = error.response.status;
        throw errorData;
    }
};

