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
    .isLength({min: 1, max: 500})
    .withMessage("Content must be between 1 and 500 characters"),

    body("category")
    .optional()
    .isIn(['work', 'personal', 'meetings'])
    .withMessage("Category must be one of")
]
