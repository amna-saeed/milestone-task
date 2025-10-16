import { notesModel } from "../models/NotesModel.js";

// CREATE NOTE - Only for logged-in user
export const createNoteController = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const userId = req.userId; // From authMiddleware

        const note = await notesModel.create({ 
            userId,
            title, 
            content, 
            category 
        });
        
        console.log("Note created successfully for user:", userId);
        
        return res.status(201).json({
            success: true,
            message: "Note created successfully",
            note: {
                id: note.id,
                userId: note.userId,
                title: note.title,
                content: note.content,
                category: note.category,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt
            }
        });
    } catch (error) {
        console.error("Error in notes controller:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error for creating notes" 
        });
    }
};

// GET NOTES - Only logged-in user's notes
export const getNoteController = async (req, res) => {
    try {
        const userId = req.userId; // From authMiddleware
        
        // Pagination query params (optional)
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 12) || 12;
        const offset = (page - 1) * limit;

        // Filter by category (optional)
        const category = req.query.category;
        
        // WHERE clause - MUST include userId to show only user's notes
        const whereClause = { userId };
        if (category) {
            whereClause.category = category;
        }

        // Fetch only this user's notes
        const { count, rows } = await notesModel.findAndCountAll({
            where: whereClause,
            limit, 
            offset,
            order: [['createdAt', 'DESC']]
        });
        
        console.log(`Fetched ${count} notes for user: ${userId}`);
        
        return res.status(200).json({
            success: true,
            message: "Notes fetched successfully", 
            pagination: {
                totalNotes: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                notesPerPage: limit,
                filterApplied: category || 'none'
            },
            notes: rows
        });
    } catch (error) {
        console.error("Error in get notes controller:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Get Notes failed" 
        });
    }
};

// UPDATE NOTE - Only user's own note
export const updateNoteController = async (req, res) => {
    try {
        const userId = req.userId; // From authMiddleware
        const noteId = req.params.id;

        // Find note that belongs to this user only
        const note = await notesModel.findOne({ 
            where: { 
                id: noteId,
                userId: userId // Ensure user can only update their own note
            } 
        });

        if (!note) {
            return res.status(404).json({ 
                success: false, 
                message: "Note not found or you don't have permission to update it" 
            });
        }

        // Update the note
        await note.update(req.body);
        
        console.log(`Note ${noteId} updated by user ${userId}`);
        
        res.status(200).json({ 
            success: true, 
            message: "Note updated successfully", 
            note 
        });
    } catch (error) {
        console.error("Error in update notes controller:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error for updating notes" 
        });
    }
};

// DELETE NOTE - Only user's own note
export const deleteNoteController = async (req, res) => {
    try {
        const userId = req.userId; // From authMiddleware
        const noteId = req.params.id;

        // Find note that belongs to this user only
        const note = await notesModel.findOne({ 
            where: { 
                id: noteId,
                userId: userId // Ensure user can only delete their own note
            } 
        });

        if (!note) {
            return res.status(404).json({ 
                success: false, 
                message: "Note not found or you don't have permission to delete it" 
            });
            console.log("Note not found");
        }

        // Delete the note
        await note.destroy();
        
        console.log(`Note ${noteId} deleted by user ${userId}`);
        
        res.status(200).json({ 
            success: true, 
            message: "Note deleted successfully" 
        });
    } catch (error) {
        console.error("Error in delete notes controller:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error for deleting notes" 
        });
    }
};