const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { validate } = require('../middleware/validation.middleware');

router.post('/register', 
  validate('register'),
  AuthController.register
);

router.post('/login', 
  validate('login'), 
  AuthController.login
);

router.get('/verify',
  AuthController.verifyToken
);

module.exports = router; 