import { body } from 'express-validator';

export const loginValidation = [
    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),

    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required"),

]