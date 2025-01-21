const sequelize = require('../config/database');
const { User, Project, Deliverable, Evaluation, Jury } = require('../models');

async function initializeDatabase() {
  try {
    // Sincronizare forțată 
    await sequelize.sync({ force: true });
    console.log('Baza de date a fost reinițializată');

    // Creare utilizatori de test
    await User.bulkCreate([
      {
        nume: 'Popescu',
        prenume: 'Ion',
        email: 'profesor@test.com',
        parola: 'test123',
        rol: 'profesor'
      },
      {
        nume: 'Ionescu',
        prenume: 'Maria',
        email: 'student@test.com',
        parola: 'test123',
        rol: 'student'
      }
    ]);

    console.log('Date de test adăugate cu succes');
    process.exit(0);
  } catch (error) {
    console.error('Eroare la inițializarea bazei de date:', error);
    process.exit(1);
  }
}

initializeDatabase(); 