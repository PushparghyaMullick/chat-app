const jwt = require('jsonwebtoken');

const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('jwt', token, {
        httpOnly: true, // for XSS (cross-site scripting) attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "strict", // for CSRF (cross-site request forgery) attacks
        secure: process.env.NODE_ENV !== 'development' 
    });

    return token;
}

module.exports = { generateToken };