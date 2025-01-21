const { Project, User, Notification, Student, Evaluation, Teacher } = require('../models');
const logger = require('../utils/logger');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

class ProjectService {
  static async createProject(projectData, file) {
    const transaction = await sequelize.transaction();
    
    try {
      logger.info('Date primite pentru creare proiect:', projectData);
      
      const project = await Project.create({
        id_proiect: Math.floor(Math.random() * 1000000),
        titlu_proiect: projectData.titlu_proiect,
        descriere_proiect: projectData.descriere_proiect,
        id_elev: projectData.id_elev,
        id_profesor: projectData.id_profesor,
        file_path: file.path,
        link_demonstrativ: projectData.link_demonstrativ || null
      }, { transaction });

      logger.info('Proiect creat:', project.toJSON());

      // Selectăm exact 3 evaluatori random
      const evaluators = await Student.findAll({
        where: {
          id_elev: {
            [Op.ne]: projectData.id_elev
          }
        },
        order: sequelize.literal('RAND()'),
        limit: 3,
        transaction
      });

      if (evaluators.length < 3) {
        throw new Error('Nu sunt suficienți evaluatori disponibili');
      }

      // Creăm înregistrările în tabela evaluare
      const evaluationPromises = evaluators.map(evaluator => 
        Evaluation.create({
          id_proiect: project.id_proiect,
          id_evaluator: evaluator.id_elev,
          nota: 0
        }, { transaction })
      );

      await Promise.all(evaluationPromises);

      // Verificăm numărul de evaluări create
      const evaluationsCount = await Evaluation.count({
        where: {
          id_proiect: project.id_proiect
        },
        transaction
      });

      if (evaluationsCount !== 3) {
        throw new Error(`Au fost create doar ${evaluationsCount} evaluări în loc de 3`);
      }

      await transaction.commit();
      return project;
    } catch (error) {
      await transaction.rollback();
      logger.error('Eroare la crearea proiectului:', error);
      throw error;
    }
  }

  static async getProjects(filters) {
    try {
      let whereClause = {};
      
      if (filters.id_profesor) {
        whereClause.id_profesor = filters.id_profesor;
      } else if (filters.id_student) {
        whereClause.id_elev = filters.id_student;
      }

      const projects = await Project.findAll({
        where: whereClause,
        attributes: ['id_proiect', 'titlu_proiect', 'descriere_proiect', 'id_elev', 'id_profesor', 'nota_finala', 'file_path', 'link_demonstrativ'],
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id_elev', 'nume_elev', 'prenume_elev', 'email_elev']
          },
          {
            model: Teacher,
            as: 'teacher',
            attributes: ['id_profesor', 'nume_profesor', 'prenume_profesor', 'specializare_profesor']
          }
        ],
        order: [['id_proiect', 'DESC']]
      });

      // Transformăm rezultatul pentru frontend
      return projects.map(project => ({
        id_proiect: project.id_proiect,
        titlu_proiect: project.titlu_proiect,
        descriere_proiect: project.descriere_proiect,
        nota_finala: project.nota_finala,
        file_path: project.file_path,
        link_demonstrativ: project.link_demonstrativ,
        nume_elev: project.student?.nume_elev,
        prenume_elev: project.student?.prenume_elev,
        nume_profesor: project.teacher?.nume_profesor,
        prenume_profesor: project.teacher?.prenume_profesor
      }));

    } catch (error) {
      logger.error('Eroare la obținerea proiectelor:', error);
      throw error;
    }
  }

  static async getProjectById(projectId) {
    try {
      const project = await Project.findOne({
        where: { id_proiect: projectId },
        attributes: ['id_proiect', 'titlu_proiect', 'descriere_proiect', 'id_elev', 'id_profesor', 'nota_finala', 'file_path'],
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id_elev', 'nume_elev', 'prenume_elev']
          },
          {
            model: Teacher,
            as: 'teacher',
            attributes: ['id_profesor', 'nume_profesor', 'prenume_profesor']
          },
          {
            model: Evaluation,
            as: 'evaluations',
            attributes: ['id_evaluare', 'nota', 'id_evaluator'],
            include: [
              {
                model: Student,
                as: 'evaluator',
                attributes: ['id_elev', 'nume_elev', 'prenume_elev']
              }
            ]
          }
        ]
      });

      if (!project) {
        throw new Error('Proiectul nu a fost găsit');
      }

      return project;
    } catch (error) {
      logger.error('Eroare la obținerea proiectului:', error);
      throw error;
    }
  }

  static async getProjectsForEvaluator(evaluatorId) {
    try {
      logger.info(`Obținere proiecte pentru evaluatorul cu ID: ${evaluatorId}`);
      
      // Obținem toate proiectele asignate evaluatorului
      const evaluations = await Evaluation.findAll({
        where: {
          id_evaluator: evaluatorId
        },
        include: [
          {
            model: Project,
            as: 'project',
            attributes: ['id_proiect', 'titlu_proiect', 'descriere_proiect', 'file_path', 'link_demonstrativ'],
            include: [
              {
                model: Student,
                as: 'student',
                attributes: ['id_elev', 'nume_elev', 'prenume_elev']
              },
              {
                model: Teacher,
                as: 'teacher',
                attributes: ['id_profesor', 'nume_profesor', 'prenume_profesor']
              }
            ]
          }
        ]
      });

      logger.info(`Găsite ${evaluations.length} proiecte pentru evaluatorul ${evaluatorId}`);

      // Transformăm rezultatul pentru frontend
      const projects = evaluations.map(evaluation => {
        const project = evaluation.project;
        const evaluationDate = evaluation.data_evaluare ? new Date(evaluation.data_evaluare) : null;
        const daysSinceEvaluation = evaluationDate ? 
          Math.floor((new Date() - evaluationDate) / (1000 * 60 * 60 * 24)) : 0;

        return {
          id_proiect: project.id_proiect,
          titlu_proiect: project.titlu_proiect,
          descriere_proiect: project.descriere_proiect,
          file_path: project.file_path,
          link_demonstrativ: project.link_demonstrativ,
          nume_elev: project.student?.nume_elev,
          prenume_elev: project.student?.prenume_elev,
          nume_profesor: project.teacher?.nume_profesor,
          prenume_profesor: project.teacher?.prenume_profesor,
          nota_curenta: evaluation.nota,
          data_evaluare: evaluation.data_evaluare,
          poate_modifica: evaluation.nota === 0 || daysSinceEvaluation < 7
        };
      });

      return projects;
    } catch (error) {
      logger.error('Eroare la obținerea proiectelor pentru evaluator:', error);
      throw error;
    }
  }

  static async submitEvaluation(evaluationData) {
    try {
      const { id_proiect, id_evaluator, nota } = evaluationData;
      
      // Actualizăm nota și data evaluării în tabela evaluare folosind direct un obiect Date
      const result = await sequelize.query(
        'UPDATE evaluare SET nota = ?, data_evaluare = NOW() WHERE id_proiect = ? AND id_evaluator = ?',
        {
          replacements: [nota, id_proiect, id_evaluator],
          type: sequelize.QueryTypes.UPDATE
        }
      );

      logger.info('Evaluare actualizată:', { id_proiect, id_evaluator, nota });

      // Verificăm dacă toate evaluările au fost completate
      const allEvaluations = await Evaluation.findAll({
        where: {
          id_proiect: id_proiect
        }
      });

      // Calculăm nota finală doar dacă toate evaluările sunt complete
      const allEvaluationsComplete = allEvaluations.every(evaluation => evaluation.nota > 0);
      if (allEvaluationsComplete) {
        const averageGrade = (allEvaluations.reduce((sum, evaluation) => sum + evaluation.nota, 0) / allEvaluations.length).toFixed(2);
        
        await Project.update(
          { nota_finala: parseFloat(averageGrade) },
          { where: { id_proiect: id_proiect } }
        );
      }

      return { success: true };
    } catch (error) {
      logger.error('Eroare la salvarea evaluării:', error);
      throw error;
    }
  }

  static async assignEvaluators(projectId) {
    try {
      // Obținem toți evaluatorii disponibili
      const evaluators = await sequelize.query(
        'SELECT id_evaluator FROM evaluator WHERE id_evaluator NOT IN (SELECT id_profesor FROM proiect WHERE id_proiect = ?)',
        [projectId]
      );

      if (evaluators.length < 3) {
        throw new Error('Nu sunt suficienți evaluatori disponibili');
      }

      // Amestecăm array-ul de evaluatori
      const shuffledEvaluators = evaluators.sort(() => Math.random() - 0.5);

      // Selectăm primii 3 evaluatori
      const selectedEvaluators = shuffledEvaluators.slice(0, 3);

      // Inserăm evaluatorii în tabelul de evaluări
      for (const evaluator of selectedEvaluators) {
        await sequelize.query(
          'INSERT INTO evaluare (id_proiect, id_evaluator) VALUES (?, ?)',
          [projectId, evaluator.id_evaluator]
        );
      }

      return true;
    } catch (error) {
      console.error('Eroare la asignarea evaluatorilor:', error);
      throw error;
    }
  }
}

module.exports = ProjectService; 