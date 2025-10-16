import {body} from 'express-validator';

export const notesValidation = [
    body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({min:1, max: 50})
    .withMessage("Title must be between 3 and 10 characters"),

    body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({min: 1, max: 100})
    .withMessage("Content must be between 10 and 100 characters"),

    body("category")
    .optional()
    .isIn(['work', 'personal', 'meetings'])
    .withMessage("Category must be one of")
]
