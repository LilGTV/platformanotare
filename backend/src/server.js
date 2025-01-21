require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3001;

// Testare conexiune la baza de date
sequelize.authenticate()
  .then(() => {
    logger.info('Conexiune la baza de date stabilită cu succes.');
  })
  .catch(err => {
    logger.error('Eroare la conectarea la baza de date:', err);
  });

// Pornire server
app.listen(PORT, () => {
  logger.info(`Serverul rulează pe portul ${PORT}`);
});

// Gestionare erori neașteptate
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION!  Închidere...');
  logger.error(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION!  Închidere...');
  logger.error(err);
  process.exit(1);
}); 