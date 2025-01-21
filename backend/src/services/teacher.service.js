const { Teacher } = require('../models');
const logger = require('../utils/logger');
const { AppError } = require('../utils/error-handler');

class TeacherService {
  static async getAllTeachers() {
    try {
      logger.info('Începere preluare profesori');
      
      const teachers = await Teacher.findAll({
        attributes: ['id_profesor', 'nume_profesor', 'prenume_profesor', 'specializare_profesor'],
        order: [['nume_profesor', 'ASC']]
      });

      if (!teachers || teachers.length === 0) {
        logger.warn('Nu s-au găsit profesori în baza de date');
        return [];
      }

      logger.info(`S-au găsit ${teachers.length} profesori`);
      return teachers;
    } catch (error) {
      logger.error('Eroare la preluarea profesorilor:', error);
      throw new AppError('Eroare la preluarea listei de profesori', 500);
    }
  }
}

module.exports = TeacherService; 