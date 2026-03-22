import express from "express";
import { verifyToken } from '../middlewares/auth';
import {getUsersByLevel, getUserDownline, getSummary, globalCredit} from "../controllers/adminController";

const router = express.Router();

router.use(verifyToken);

/**
 * @openapi
 * /admin/users/level/{level}:
 *   get:
 *     summary: Get users by hierarchy level
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: level
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of users at level
 */
router.get('/users/level/:level', getUsersByLevel);

/**
 * @openapi
 * /admin/users/{id}/downline:
 *   get:
 *     summary: Get downline for a specific user ID
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Downline users
 */
router.get('/users/:id/downline', getUserDownline);

/**
 * @openapi
 * /admin/summary:
 *   get:
 *     summary: Get system summary totals
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Summary system metrics
 */
router.get('/summary', getSummary);

/**
 * @openapi
 * /admin/credit:
 *   post:
 *     summary: Globally credit amount to  a user, deduct from parent
 *     tags: [Admin]
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
 *         description: Credit executed
 */
router.post('/credit', globalCredit);

export default router;  