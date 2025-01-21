const DeliverableService = require('../services/deliverable.service');
const { AppError } = require('../utils/error-handler');

class DeliverableController {
  static async createDeliverable(req, res, next) {
    try {
      const { id_proiect } = req.params;
      const deliverable = await DeliverableService.createDeliverable(
        id_proiect,
        req.body,
        req.user.id
      );

      res.status(201).json({
        status: 'success',
        data: deliverable
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateDeliverable(req, res, next) {
    try {
      const { id_livrabil } = req.params;
      const deliverable = await DeliverableService.updateDeliverable(
        id_livrabil,
        req.body,
        req.user.id
      );

      res.json({
        status: 'success',
        data: deliverable
      });
    } catch (error) {
      next(error);
    }
  }

  static async addVideoOrUrl(req, res, next) {
    try {
      const { id_livrabil } = req.params;
      const deliverable = await DeliverableService.addVideoOrUrl(
        id_livrabil,
        req.body,
        req.user.id
      );

      res.json({
        status: 'success',
        data: deliverable
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProjectDeliverables(req, res, next) {
    try {
      const { id_proiect } = req.params;
      const deliverables = await DeliverableService.getProjectDeliverables(
        id_proiect,
        req.user.id
      );

      res.json({
        status: 'success',
        data: deliverables
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DeliverableController; 