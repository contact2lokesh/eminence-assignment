import express from 'express';
import { verifyToken } from '../middlewares/auth';
import { getMe, getDownline, createNextLevelUser, changeNextLevelPassword } from '../controllers/userController';

const router = express.Router();

router.use(verifyToken);

router.get('/me', getMe);
router.get('/downline', getDownline);
router.post('/', createNextLevelUser);
router.put('/:id/password', changeNextLevelPassword);

export default router;
