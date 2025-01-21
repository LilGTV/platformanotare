const { AppError } = require('../utils/error-handler');

const isStudent = (req, res, next) => {
  if (req.user.rol !== 'student') {
    return next(new AppError('Acces interzis. Doar studenții au acces.', 403));
  }
  next();
};

const isTeacher = (req, res, next) => {
  if (req.user.rol !== 'profesor') {
    return next(new AppError('Acces interzis. Doar profesorii au acces.', 403));
  }
  next();
};

module.exports = {
  isStudent,
  isTeacher
}; 