import express from "express";
import { verifyToken } from '../middlewares/auth';
import {selfRecharge, transferBalance, getStatement} from "../controllers/transferController";

const router = express.Router();

router.use(verifyToken);

router.post('/recharge', selfRecharge);
router.post('/transfer', transferBalance);
router.get('/statement', getStatement);


export default router;
