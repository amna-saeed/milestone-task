import { validationResult } from 'express-validator';

export const loginValidation =(req, res, next)=> {
    const errors = validationResult(req);
    console.log(errors);
    console.log("running login validation");
    
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }));
        return res.status(400).json({ errors: formattedErrors });
    }
    next();
}