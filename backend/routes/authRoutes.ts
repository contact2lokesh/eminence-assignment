import express from 'express';
import {generateCaptcha, registerOwner, login, logout } from '../controllers/authController';

const router = express.Router();

router.get('/captcha', generateCaptcha);
router.post('/register', registerOwner);
router.post('/login', login);
router.post('/logout', logout);

export default router;
