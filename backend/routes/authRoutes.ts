import express from 'express';
import {generateCaptcha, registerOwner, login, logout } from '../controllers/authController';

const router = express.Router();

/**
 * @openapi
 * /auth/captcha:
 *   get:
 *     summary: Generate a CAPTCHA Image
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Returns SVG captcha data
 */
router.get('/captcha', generateCaptcha);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register the System Owner
 *     tags: [Authentication]
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
 *         description: Owner registered successfully
 */
router.post('/register', registerOwner);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               captchaText:
 *                 type: string
 *               captchaSessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 */
router.post('/login', login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successful logout
 */
router.post('/logout', logout);

export default router;
