const TeacherService = require('../services/teacher.service');
const logger = require('../utils/logger');
const { AppError } = require('../utils/error-handler');

class TeacherController {
  static async getAllTeachers(req, res, next) {
    try {
      logger.info('Cerere primită pentru lista profesorilor');
      
      const teachers = await TeacherService.getAllTeachers();
      
      res.status(200).json({
        status: 'success',
        data: teachers
      });
    } catch (error) {
      logger.error('Eroare în controller la preluarea profesorilor:', error);
      next(error);
    }
  }
}

module.exports = TeacherController; 