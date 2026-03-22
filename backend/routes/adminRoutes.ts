import express from "express";
import { verifyToken } from '../middlewares/auth';
import {getUsersByLevel, getUserDownline, getSummary, globalCredit} from "../controllers/adminController";

const router = express.Router();

router.use(verifyToken);

router.get('/users/level/:level', getUsersByLevel);
router.get('/users/:id/downline', getUserDownline);
router.get('/summary', getSummary);
router.post('/credit', globalCredit);

export default router;  