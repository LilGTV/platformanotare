const express = require('express');
const router = express.Router();
const JuryController = require('../controllers/jury.controller');
const { isTeacher } = require('../middleware/role.middleware');

router.post('/livrabil/:id_livrabil/selectare',
  isTeacher,
  JuryController.selectRandomJury
);

router.get('/livrabil/:id_livrabil/verificare',
  JuryController.checkJuryMembership
);

module.exports = router; 