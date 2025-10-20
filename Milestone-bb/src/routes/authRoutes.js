import { Router } from 'express';

// register
import {registerValidation as checkValidation} from '../middlewares/RegisterValidation.js';
import {registerValidation} from '../validators/registerValidation.js';
import {register} from '../controllers/registerController.js';

// login
import {loginValidation} from '../validators/loginValidation.js';
import {login} from '../controllers/loginController.js';    
import {loginValidation as checkLoginValidation} from '../middlewares/LoginValidation.js';

// update password
import { updatePassword } from '../controllers/passwordController.js';
import { authenticateMiddleware } from '../middlewares/authenticateMiddleware.js';

const router = Router();

router.post('/register', registerValidation, checkValidation, register);
router.post('/login', loginValidation, checkLoginValidation, login);

router.put('/update-password', authenticateMiddleware, updatePassword);

export default router;