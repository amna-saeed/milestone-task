import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next)=> {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer')){
            return res.status(401).json({message: 'Unauthorized'});
        }

        // access token
        const token  = authHeader.split(' ')[1];

        // verify token
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        // add user id to request object
        req.userId = decoded.userId;

        next();
    }catch(error){
        console.error('Auth middleware error:', error);
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token' 
        });
    }
}