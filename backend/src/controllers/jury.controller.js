const JuryService = require('../services/jury.service');
const { AppError } = require('../utils/error-handler');

class JuryController {
  // Selectare juriu aleatoriu pentru un livrabil
  static async selectRandomJury(req, res, next) {
    try {
      const { id_livrabil } = req.params;
      const { number_of_members } = req.body;
      
      const juryMembers = await JuryService.selectRandomJury(
        id_livrabil,
        number_of_members
      );

      res.status(201).json({
        status: 'success',
        data: {
          jury_members: juryMembers
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Verificare dacă un utilizator este membru în juriu
  static async checkJuryMembership(req, res, next) {
    try {
      const { id_livrabil } = req.params;
      const jury = await Jury.findOne({
        where: {
          deliverableId: id_livrabil,
          membruId: req.user.id
        }
      });

      res.json({
        status: 'success',
        data: {
          is_jury_member: !!jury
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = JuryController; 