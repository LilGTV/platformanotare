const EvaluationService = require('../services/evaluation.service');

class EvaluationController {
  static async createEvaluation(req, res, next) {
    try {
      const evaluation = await EvaluationService.createEvaluation(
        req.body,
        req.user.id
      );
      res.status(201).json({
        status: 'success',
        data: evaluation
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProjectEvaluations(req, res, next) {
    try {
      const { id_proiect } = req.params;
      const evaluations = await EvaluationService.getProjectEvaluations(
        id_proiect,
        req.user.rol === 'profesor'
      );
      res.json({
        status: 'success',
        data: evaluations
      });
    } catch (error) {
      next(error);
    }
  }

  static async calculateFinalGrade(req, res, next) {
    try {
      const { id_proiect } = req.params;
      const finalGrade = await EvaluationService.calculateFinalGrade(id_proiect);
      res.json({
        status: 'success',
        data: {
          nota_finala: finalGrade
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EvaluationController; 