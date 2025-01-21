const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Testăm conexiunea
sequelize.authenticate()
  .then(() => {
    console.log('Conexiune la baza de date stabilită cu succes.');
  })
  .catch(err => {
    console.error('Eroare la conectarea la baza de date:', err);
  });

module.exports = sequelize; 