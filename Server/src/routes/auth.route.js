import { Router } from 'express';
import { signup, login, logout, verifyEmail } from '../controllers/auth.controller.js';

const router = Router();

router.post('/signup', signup)
router.post('/login', login)
router.post('/verify-email', verifyEmail)
router.post('/logout', logout)



export default router