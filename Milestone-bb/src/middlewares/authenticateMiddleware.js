import jwt from 'jsonwebtoken';
import { userModel } from '../models/UserModel.js';

export const authenticateMiddleware = async (req, res, next) => {
    const token = req.header('authorization')?.replace('Bearer ', ''); 

    console.log(token)
    if (!token) return res.status(401).json({ message: 'Unauthorized' });


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        const user = await userModel.findByPk(decoded.id); 
        if (!user) throw new Error('User not found');
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
