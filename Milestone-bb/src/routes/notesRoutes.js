import { Router } from 'express';
import {createNoteController, getNoteController, updateNoteController, deleteNoteController} from '../controllers/notesController.js';
import {notesValidation as notesValidationRules} from '../validators/NotesValidation.js';
import {notesValidation as checkNotesValidation} from '../middlewares/NotesValidation.js';
import {authMiddleware} from '../middlewares/authMiddleware.js';

const router = Router();

// Notes CRUD Routes

// POST /api/notes
router.post('/', authMiddleware, notesValidationRules, checkNotesValidation, createNoteController);   

// GET /api/notes  
router.get('/', authMiddleware, getNoteController);      

// PUT /api/notes/:id
router.put('/:id', authMiddleware, notesValidationRules, checkNotesValidation, updateNoteController);   

// DELETE /api/notes/:id
router.delete('/:id', authMiddleware, deleteNoteController);                 

export default router;

