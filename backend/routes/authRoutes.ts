import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

router.get('/captcha', authController.generateCaptcha);
router.post('/register', authController.registerOwner);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

export default router;
