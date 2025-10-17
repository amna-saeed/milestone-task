import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. Please login first to access this notes.' 
            });
        }

        // Extract token (format: "Bearer TOKEN")
        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add userEmail to request object for use in controllers
        req.userEmail = decoded.email;
        
        console.log(`User ${decoded.email} authenticated successfully`);
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token. Please login again.' 
        });
    }
};
