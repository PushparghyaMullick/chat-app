const express = require('express');
const { check } = require('express-validator');

const { signup, login, logout, updateProfile, checkAuth } = require('../controllers/auth-controller');
const protectRoute = require('../middleware/protect-route');

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

module.exports = router;