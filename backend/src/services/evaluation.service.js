const { Evaluation, Project, Student } = require('../models');
const { AppError } = require('../utils/error-handler');
const { Op } = require('sequelize');

class EvaluationService {
  static async createEvaluation(evaluationData, studentId) {
    // Verificăm dacă studentul nu evaluează propriul proiect
    const project = await Project.findByPk(evaluationData.id_proiect);
    if (!project) {
      throw new AppError('Proiectul nu există', 404);
    }

    if (project.id_elev === studentId) {
      throw new AppError('Nu poți evalua propriul proiect', 403);
    }

    // Verificăm dacă studentul nu a evaluat deja acest proiect
    const existingEvaluation = await Evaluation.findOne({
      where: {
        id_proiect: evaluationData.id_proiect,
        id_evaluator: studentId
      }
    });

    if (existingEvaluation) {
      throw new AppError('Ai evaluat deja acest proiect', 400);
    }

    const evaluation = await Evaluation.create({
      id_proiect: evaluationData.id_proiect,
      id_evaluator: studentId,
      nota: evaluationData.nota
    });

    return evaluation;
  }

  static async calculateFinalGrade(projectId) {
    const evaluations = await Evaluation.findAll({
      where: { 
        id_proiect: projectId,
        nota: {
          [Op.not]: null
        }
      },
      order: [['nota', 'ASC']]
    });

    if (evaluations.length < 3) {
      throw new AppError('Număr insuficient de evaluări pentru calculul notei finale', 400);
    }

    // Eliminăm cea mai mică și cea mai mare notă
    const filteredGrades = evaluations.slice(1, -1);
    
    // Calculăm media
    const sum = filteredGrades.reduce((acc, evaluation) => acc + evaluation.nota, 0);
    const average = sum / filteredGrades.length;

    // Actualizăm nota finală în proiect
    await Project.update(
      { nota_finala: average },
      { where: { id_proiect: projectId } }
    );

    return average;
  }

  static async getProjectEvaluations(projectId, isTeacher = false) {
    const evaluations = await Evaluation.findAll({
      where: { id_proiect: projectId },
      include: [{
        model: Student,
        as: 'evaluator',
        attributes: isTeacher ? ['id_elev', 'nume_elev', 'prenume_elev'] : []
      }],
      attributes: ['id_evaluare', 'nota'],
      order: [['id_evaluare', 'DESC']]
    });

    return evaluations;
  }
}

module.exports = EvaluationService; 