const jwt = require('jsonwebtoken');
require('dotenv');
require('../message/message');
class auth {
    static async authenticateToken(req, res, next) {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: not_token });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: Invalid_token });
            }
            req.userId = decoded.userId;
            next();
        });
    }
}



module.exports = auth;