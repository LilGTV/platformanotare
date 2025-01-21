const { PartialDeliverable, Project, User, Jury } = require('../models');
const { AppError } = require('../utils/error-handler');

class DeliverableService {
  static async createDeliverable(projectId, deliverableData, userId) {
    const project = await Project.findByPk(projectId);
    
    if (!project) {
      throw new AppError('Proiectul nu există', 404);
    }

    if (project.membruPrincipalId !== userId) {
      throw new AppError('Doar membrul principal poate adăuga livrabile', 403);
    }

    const deliverable = await PartialDeliverable.create({
      ...deliverableData,
      ProjectId: projectId
    });

    return deliverable;
  }

  static async updateDeliverable(deliverableId, updateData, userId) {
    const deliverable = await PartialDeliverable.findByPk(deliverableId, {
      include: [{ model: Project }]
    });

    if (!deliverable) {
      throw new AppError('Livrabilul nu există', 404);
    }

    if (deliverable.Project.membruPrincipalId !== userId) {
      throw new AppError('Nu aveți permisiunea să modificați acest livrabil', 403);
    }

    if (deliverable.status !== 'in_asteptare') {
      throw new AppError('Nu puteți modifica un livrabil care este în evaluare sau evaluat', 400);
    }

    await deliverable.update(updateData);
    return deliverable;
  }

  static async addVideoOrUrl(deliverableId, updateData, userId) {
    const deliverable = await PartialDeliverable.findByPk(deliverableId, {
      include: [{ model: Project }]
    });

    if (!deliverable) {
      throw new AppError('Livrabilul nu există', 404);
    }

    if (deliverable.Project.membruPrincipalId !== userId) {
      throw new AppError('Nu aveți permisiunea să modificați acest livrabil', 403);
    }

    const { videoUrl, proiectUrl } = updateData;
    await deliverable.update({
      videoUrl,
      proiectUrl,
      status: 'in_evaluare'
    });

    return deliverable;
  }

  static async getProjectDeliverables(projectId, userId) {
    const project = await Project.findByPk(projectId);
    
    if (!project) {
      throw new AppError('Proiectul nu există', 404);
    }

    const deliverables = await PartialDeliverable.findAll({
      where: { ProjectId: projectId },
      order: [['dataLimita', 'ASC']]
    });

    return deliverables;
  }
}

module.exports = DeliverableService; 