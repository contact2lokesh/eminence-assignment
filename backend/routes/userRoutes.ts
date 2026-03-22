import express from 'express';
import { verifyToken } from '../middlewares/auth';
import { getMe, getDownline, createNextLevelUser, changeNextLevelPassword } from '../controllers/userController';

const router = express.Router();

router.use(verifyToken);

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Get current authenticated user details
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
router.get('/me', getMe);

/**
 * @openapi
 * /users/downline:
 *   get:
 *     summary: Get user downline hierarchy
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: all
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: If true, returns entire tree. If false, returns direct children.
 *     responses:
 *       200:
 *         description: List of downline users
 */
router.get('/downline', getDownline);

/**
 * @openapi
 * /users/:
 *   post:
 *     summary: Create next level user in downline
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/', createNextLevelUser);

/**
 * @openapi
 * /users/{id}/password:
 *   put:
 *     summary: Change password of a direct downline child
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 */
router.put('/:id/password', changeNextLevelPassword);

export default router;
