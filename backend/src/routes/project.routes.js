const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/project.controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');

// Crează directorul pentru încărcări dacă nu există
const uploadDir = path.join(__dirname, '../../uploads/projects');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurare multer pentru încărcarea fișierelor
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.zip', '.rar', '.7z'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Format de fișier neacceptat'));
    }
  }
});

// Rute pentru evaluatori (trebuie să fie înaintea rutelor cu parametri)
router.get('/evaluator', authenticateToken, ProjectController.getProjectsForEvaluator);
router.post('/evaluare', authenticateToken, ProjectController.submitEvaluation);

// Rute generale
router.post('/', upload.single('file'), ProjectController.uploadProject);
router.get('/', ProjectController.getProjects);

// Rute cu parametri (trebuie să fie ultimele)
router.get('/:id/download', ProjectController.downloadProject);

module.exports = router; 