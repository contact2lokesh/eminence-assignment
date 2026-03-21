import express from 'express';
import { verifyToken } from '../middlewares/auth';
import { getMe } from '../controllers/userController';

const router = express.Router();

router.get('/me', verifyToken, getMe);

export default router;
