const express = require('express');
const router = express.Router();
const TeacherController = require('../controllers/teacher.controller');

// GET /api/profesori
router.get('/', TeacherController.getAllTeachers);

module.exports = router; 