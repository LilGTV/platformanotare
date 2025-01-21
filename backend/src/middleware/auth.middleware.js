const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      logger.error('Token lipsă');
      throw new AppError('Token necesar pentru autentificare', 401);
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      logger.error('Token invalid');
      throw new AppError('Token invalid', 401);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      logger.info(`Utilizator autentificat: ${decoded.id}`);
      next();
    } catch (jwtError) {
      logger.error('Eroare verificare JWT:', jwtError);
      throw new AppError('Token invalid sau expirat', 401);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware; 