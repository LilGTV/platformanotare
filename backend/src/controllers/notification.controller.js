const NotificationService = require('../services/notification.service');
const logger = require('../utils/logger');

class NotificationController {
  static async getNotifications(req, res, next) {
    try {
      const notifications = await NotificationService.getNotifications(req.user.id);
      res.json({
        status: 'success',
        data: notifications
      });
    } catch (error) {
      logger.error('Eroare la obținerea notificărilor:', error);
      next(error);
    }
  }
}

module.exports = NotificationController; 