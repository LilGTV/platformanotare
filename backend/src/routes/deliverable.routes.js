const express = require('express');
const router = express.Router();
const DeliverableController = require('../controllers/deliverable.controller');
const { isProjectMember } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validation.middleware');

// Rute pentru livrabile parțiale
router.post('/proiect/:id_proiect/livrabile',
  isProjectMember,
  validate('partialDeliverable'),
  DeliverableController.createDeliverable
);

router.put('/livrabile/:id_livrabil',
  isProjectMember,
  validate('partialDeliverable'),
  DeliverableController.updateDeliverable
);

router.patch('/livrabile/:id_livrabil/upload',
  isProjectMember,
  validate('partialDeliverable'),
  DeliverableController.addVideoOrUrl
);

router.get('/proiect/:id_proiect/livrabile',
  isProjectMember,
  DeliverableController.getProjectDeliverables
);

module.exports = router; 