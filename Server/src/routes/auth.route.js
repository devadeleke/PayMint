import { Router } from 'express';
import { checkAuth, signup, login, logout, verifyEmail, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/check-auth', protectRoute, checkAuth);
router.post('/signup', signup)
router.post('/login', login)
router.post('/verify-email', verifyEmail)
router.post('/logout', logout)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

export default router;