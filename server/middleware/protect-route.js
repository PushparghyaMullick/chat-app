const jwt = require('jsonwebtoken');
const User = require('../models/user')

module.exports = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if(!decodedToken){
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        const user = await User.findById(decodedToken.userId).select("-password");
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}