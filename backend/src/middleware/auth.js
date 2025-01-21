const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn('Token lipsă în cerere');
    return res.status(401).json({ error: 'Token de autentificare lipsă' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Eroare la verificarea token-ului:', error);
    return res.status(403).json({ error: 'Token invalid sau expirat' });
  }
};

module.exports = {
  authenticateToken
}; 