import { userModel } from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async(req, res)=> {
    try{
        const {email, password} = req.body;
        console.log("Login attempt with email:", email);

        // check user
        const user = await userModel.findOne({where: {email}});
        console.log("User found:", user ? "Yes" : "No");
        
        if(!user){
            return res.status(400).json({ message: 'Email is not registered. Please register first' });
        }

        // check password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({ message: 'Your email is registered but password does not match. Please try again'});
        }

        // generate token
        const token = jwt.sign({userId: user.userId}, process.env.JWT_SECRET);
        return res.status(200).json({ message: 'Login successful', token });
    }catch (error) {
        console.error('Error in login controller:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}