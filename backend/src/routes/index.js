const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const projectRoutes = require('./project.routes');
const teacherRoutes = require('./teacher.routes');
const notificationRoutes = require('./notification.routes');
const authMiddleware = require('../middleware/auth.middleware');

// Rute publice
router.use('/auth', authRoutes);

// Rute protejate
router.use('/profesori', authMiddleware, teacherRoutes);
router.use('/proiecte', authMiddleware, projectRoutes);
router.use('/notificari', authMiddleware, notificationRoutes);

module.exports = router;
