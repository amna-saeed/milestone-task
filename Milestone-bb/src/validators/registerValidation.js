import { body } from 'express-validator';

export const registerValidation=[
        
    body('name')
        .trim()
        .customSanitizer(value => value.replace(/\s+/g, ''))
        .notEmpty()
        .withMessage('Full name is required')
        .isLength({ min: 3, max:25})
        .withMessage('Full name must be at least 3 characters long and less than 25 characters')
        .matches(/^[a-zA-Z]+$/)
        .withMessage('Full name can only contain letters'),
    
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address'),
       
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 5, max:25 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]+$/)
        .withMessage('Password must contain at least one special character'),
    
    body('confirmPassword')
        .trim()
        .notEmpty()
        .withMessage('Please confirm your password')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
];