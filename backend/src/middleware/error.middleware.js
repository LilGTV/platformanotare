const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}`);

  // Erori operaționale cunoscute
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Erori Sequelize
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));

    return res.status(400).json({
      status: 'error',
      message: 'Datele introduse nu sunt valide',
      errors
    });
  }

  // Erori JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token invalid'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token expirat'
    });
  }

  // Eroare implicită pentru producție
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      status: 'error',
      message: 'A apărut o eroare internă'
    });
  }

  // Eroare detaliată pentru development
  return res.status(500).json({
    status: 'error',
    message: err.message,
    stack: err.stack,
    error: err
  });
};

module.exports = errorHandler; 