const { Notification } = require('../models');
const logger = require('../utils/logger');

class NotificationService {
  static async createNotification(notificationData) {
    try {
      const notification = await Notification.create(notificationData);
      return notification;
    } catch (error) {
      logger.error('Eroare la crearea notificării:', error);
      throw error;
    }
  }

  static async getNotifications(userId) {
    try {
      const notifications = await Notification.findAll({
        where: { id_destinatar: userId },
        order: [['created_at', 'DESC']]
      });
      return notifications;
    } catch (error) {
      logger.error('Eroare la obținerea notificărilor:', error);
      throw error;
    }
  }
}

module.exports = NotificationService; 