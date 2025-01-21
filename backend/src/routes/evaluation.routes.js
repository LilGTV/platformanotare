const express = require('express');
const router = express.Router();
const EvaluationController = require('../controllers/evaluation.controller');
const { validate } = require('../middleware/validation.middleware');
const { isStudent, isTeacher } = require('../middleware/role.middleware');

router.post('/',
  isStudent,
  validate('evaluation'),
  EvaluationController.createEvaluation
);

router.get('/proiect/:id_proiect',
  EvaluationController.getProjectEvaluations
);

router.post('/proiect/:id_proiect/nota-finala',
  isTeacher,
  EvaluationController.calculateFinalGrade
);

module.exports = router; 