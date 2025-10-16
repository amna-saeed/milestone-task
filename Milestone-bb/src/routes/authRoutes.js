import { Router } from 'express';

// register
import {registerValidation as checkValidation} from '../middlewares/RegisterValidation.js';
import {registerValidation} from '../validators/registerValidation.js';
import {register} from '../controllers/registerController.js';

// login
import {loginValidation} from '../validators/loginValidation.js';
import {login} from '../controllers/loginController.js';    
import {loginValidation as checkLoginValidation} from '../middlewares/LoginValidation.js';

const router = Router();

router.post('/register', registerValidation, checkValidation, register);
router.post('/login', loginValidation, checkLoginValidation, login);

export default router;