import { userModel } from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async(req, res)=> {
    try{
        const {name, email, password, confirmPassword} = req.body;
        console.log("Register data:", { name, email });

        // check password validation
        if(password !== confirmPassword){
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // check if email already exists
        const existingEmail = await userModel.findOne({ where: { email } });
        if(existingEmail){
            return res.status(400).json({ message: 'Yorr email is already registered, Go to login' });
        }

        // Auto-generate userId (count + 1)
        const userCount = await userModel.count();
        const userId = String(userCount + 1);
        console.log("Generated userId:", userId);

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = await userModel.create({ userId, name, email, password: hashedPassword });
        console.log("User created:", { userId: user.userId, email: user.email });
        
        return res.status(201).json({ message: 'User created successfully', user: {
            id: user.id,
            userId: user.userId,
            name: user.name,
            email: user.email
        }});

    } catch (error) {
        console.error('Error in register controller:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};