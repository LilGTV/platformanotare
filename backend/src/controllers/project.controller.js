const ProjectService = require('../services/project.service');
const NotificationService = require('../services/notification.service');
const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs');

class ProjectController {
  static async uploadProject(req, res, next) {
    try {
      logger.info('Date primite�n request:', {
        body: req.body,
        file: req.file,
        link_demonstrativ: req.body.link_demonstrativ
      });

      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'Niciun fișier încărcat'
        });
      }

      if (!req.body.title || !req.body.description || !req.body.professorId) {
        return res.status(400).json({
          status: 'error',
          message: 'Toate câmpurile sunt obligatorii'
        });
      }

      const projectData = {
        titlu_proiect: req.body.title,
        descriere_proiect: req.body.description,
        id_profesor: req.body.professorId,
        id_elev: req.user.id_elev || req.user.id,
        link_demonstrativ: req.body.link_demonstrativ || null
      };

      logger.info('Date pregătite pentru creare proiect:', projectData);

      const project = await ProjectService.createProject(projectData, req.file);

      res.status(201).json({
        status: 'success',
        message: 'Proiect încărcat cu succes',
        data: project
      });
    } catch (error) {
      logger.error('Eroare la încărcarea proiectului:', error);
      next(error);
    }
  }

  static async getProjects(req, res, next) {
    try {
      logger.info('Cerere pentru proiecte cu filtrele:', req.query);
      const projects = await ProjectService.getProjects(req.query);
      
      res.json({
        status: 'success',
        data: projects
      });
    } catch (error) {
      logger.error('Eroare la obținerea proiectelor:', error);
      next(error);
    }
  }

  static async downloadProject(req, res, next) {
    try {
      const projectId = req.params.id;
      const project = await ProjectService.getProjectById(projectId);

      if (!project) {
        return res.status(404).json({
          status: 'error',
          message: 'Proiectul nu a fost găsit'
        });
      }

      // Verificăm dacă utilizatorul are dreptul să descarce proiectul
      if (req.user.rol === 'profesor' && project.id_profesor !== req.user.id) {
        return res.status(403).json({
          status: 'error',
          message: 'Nu aveți permisiunea de a descărca acest proiect'
        });
      }

      const filePath = project.file_path;
      if (!filePath || !fs.existsSync(filePath)) {
        return res.status(404).json({
          status: 'error',
          message: 'Fișierul proiectului nu a fost găsit'
        });
      }

      const fileName = path.basename(filePath);
      res.download(filePath, fileName, (err) => {
        if (err) {
          logger.error('Eroare la descărcarea fișierului:', err);
          if (!res.headersSent) {
            res.status(500).json({
              status: 'error',
              message: 'Eroare la descărcarea fișierului'
            });
          }
        }
      });
    } catch (error) {
      logger.error('Eroare la descărcarea proiectului:', error);
      next(error);
    }
  }

  static async getProjectsForEvaluator(req, res) {
    try {
      const { id_evaluator } = req.query;
      logger.info(`Cerere pentru proiectele evaluatorului ${id_evaluator}`);
      
      const projects = await ProjectService.getProjectsForEvaluator(id_evaluator);
      res.json(projects);
    } catch (error) {
      logger.error('Eroare la obținerea proiectelor pentru evaluator:', error);
      res.status(500).json({ error: 'Eroare la obținerea proiectelor' });
    }
  }

  static async submitEvaluation(req, res) {
    try {
      const evaluationData = req.body;
      logger.info(`Primire evaluare pentru proiectul ${evaluationData.id_proiect}`);
      
      const result = await ProjectService.submitEvaluation(evaluationData);
      res.json(result);
    } catch (error) {
      logger.error('Eroare la salvarea evaluării:', error);
      res.status(500).json({ error: 'Eroare la salvarea evaluării' });
    }
  }
}

module.exports = ProjectController; 