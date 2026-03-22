import express from "express";
import { verifyToken } from '../middlewares/auth';
import {selfRecharge, transferBalance, getStatement} from "../controllers/transferController";

const router = express.Router();

router.use(verifyToken);

/**
 * @openapi
 * /balance/recharge:
 *   post:
 *     summary: Self recharge balance (OWNER only)
 *     tags: [Transfers]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Recharge successful
 */
router.post('/recharge', selfRecharge);

/**
 * @openapi
 * /balance/transfer:
 *   post:
 *     summary: Transfer balance to direct downline user
 *     tags: [Transfers]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiverId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transfer successful
 */
router.post('/transfer', transferBalance);

/**
 * @openapi
 * /balance/statement:
 *   get:
 *     summary: Get balance transaction statement
 *     tags: [Transfers]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get('/statement', getStatement);


export default router;
