import svgCaptcha from 'svg-captcha';
import { Request, Response } from 'express';
import bcrypt from "bcryptjs"
import User from "../models/User";

const captchaStore = new Map<string, { text: string; expiresAt: number }>();

export const generateCaptcha = (req: Request, res: Response) => {
    const captcha = svgCaptcha.create({
        size: 5,
        ignoreChars: '0o1i',
        noise: 2,
        color: true,
    });
    
    const sessionId = Math.random().toString(36).substring(2, 15);
    captchaStore.set(sessionId, {
        text: captcha.text,
        expiresAt: Date.now() + 5 * 60 * 1000 // expire in 5 minutes
    });

    res.status(200).json({
        sessionId,
        captchaSvg: captcha.data
    });
};

export const registerOwner = async (req: Request, res: Response) => {
    try {
        const { name, username, password } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Name is required.' });
        }

        if (!username || !/^[a-zA-Z]+$/.test(username)) {
            return res.status(400).json({ message: 'Username is required and must contain only letters.' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }
        
        // Check if OWNER already exists or not
        const existingOwner = await User.findOne({ role: 'OWNER' });
        if (existingOwner) {
            return res.status(403).json({ message: 'Owner already exists. Only one owner allowed.' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        
        const newOwner = new User({
            name,
            username,
            passwordHash,
            role: 'OWNER',
            level: 0
        });

        await newOwner.save();
        res.status(201).json({ message: 'Owner registered successfully.' });

    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const login = (req: Request, res: Response) => {
    const { username, password, captchaSessionId, captchaText } = req.body;
    
    console.log({username, password, captchaSessionId, captchaText});
    // Verify CAPTCHA
    const captchaData = captchaStore.get(captchaSessionId);
    if (!captchaData || captchaData.expiresAt < Date.now() || captchaData.text.toLowerCase() !== captchaText.toLowerCase()) {
        captchaStore.delete(captchaSessionId);
        return res.status(400).json({ message: 'Invalid or expired CAPTCHA' });
    }
    
    // Stub login - replace with real auth
    captchaStore.delete(captchaSessionId);
    if (username === 'admin' && password === 'password') {
        res.json({ 
            username, 
            role: 'admin', 
            level: 1,
            token: 'stub-jwt-token' 
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('auth_token');
    res.status(200).json({ message: 'Logged out successfully' });
};
