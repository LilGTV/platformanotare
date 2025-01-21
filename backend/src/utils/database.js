const mysql = require('mysql2/promise');
const logger = require('./logger');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'platforma_notare',
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    logger.info('Conectat cu succes la baza de date platforma_notare');
    connection.release();
  } catch (error) {
    logger.error('Eroare la conectarea cu baza de date:', error);
    logger.error('Aplicația va continua să ruleze, dar funcționalitatea bazei de date poate fi afectată');
  }
};

testConnection();

module.exports = pool; 