const { User, Jury, Project, Deliverable } = require('../models');
const { AppError } = require('../utils/error-handler');
const { Op } = require('sequelize');

class JuryService {
  static async selectRandomJury(deliverableId, numberOfMembers = 3) {
    const deliverable = await Deliverable.findByPk(deliverableId, {
      include: [{
        model: Project,
        attributes: ['id', 'membruPrincipalId', 'membriEchipaId']
      }]
    });

    if (!deliverable) {
      throw new AppError('Livrabilul nu a fost găsit', 404);
    }

    // Găsim toți studenții care nu sunt în echipa proiectului și nu sunt MP la alte proiecte
    const eligibleStudents = await User.findAll({
      where: {
        rol: 'student',
        id: {
          [Op.notIn]: [
            ...deliverable.Project.membriEchipaId,
            deliverable.Project.membruPrincipalId
          ]
        }
      }
    });

    if (eligibleStudents.length < numberOfMembers) {
      throw new AppError('Nu sunt suficienți evaluatori disponibili', 400);
    }

    // Amestecăm și selectăm aleatoriu
    const selectedStudents = eligibleStudents
      .sort(() => Math.random() - 0.5)
      .slice(0, numberOfMembers);

    // Creăm înregistrările pentru juriu
    const juryMembers = await Promise.all(
      selectedStudents.map(student =>
        Jury.create({
          deliverableId,
          membruId: student.id,
          dataSelectie: new Date()
        })
      )
    );

    return juryMembers;
  }

  static async getJuryMembers(deliverableId) {
    const jury = await Jury.findAll({
      where: { deliverableId },
      include: [{
        model: User,
        attributes: ['id', 'nume', 'prenume', 'email']
      }]
    });

    return jury;
  }
}

module.exports = JuryService; 