import express from 'express';
import { check } from 'express-validator';
import { signup, login, logout, updateProfile, checkAuth } from '../controllers/auth-controller.js';
import protectRoute from '../middleware/protect-route.js';

const router = express.Router();

router.post('/signup',
    [
        check('username').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min: 8})
    ], 
    signup)
router.post('/login',
    [
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min: 8})
    ],
    login)
router.use(protectRoute);
router.post('/logout', logout)
router.put('/:uid/update', updateProfile)
router.get('/check', checkAuth)  // whenever refreshing page

export default router;