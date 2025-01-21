const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notification.controller');

router.get('/', NotificationController.getNotifications);

module.exports = router; 