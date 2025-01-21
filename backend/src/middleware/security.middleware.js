const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

// Rate limiting pentru API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 100, // limită de 100 de cereri per fereastră
  message: 'Prea multe cereri de la această adresă IP'
});

// Rate limiting specific pentru autentificare
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 10, // limită de 10 încercări per fereastră
  message: 'Prea multe încercări de autentificare'
});

const securityMiddleware = (app) => {
  app.use(helmet());
  app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(xss());
  app.use(hpp());
  
  // Aplicare rate limiting
  app.use('/api/', apiLimiter);
  app.use('/api/auth', authLimiter);
};

module.exports = securityMiddleware; 