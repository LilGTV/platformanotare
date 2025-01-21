const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Teacher = sequelize.define('Teacher', {
  id_profesor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  nume_profesor: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  prenume_profesor: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email_profesor: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  parola_profesor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  specializare_profesor: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'profesor',
  timestamps: false
});

module.exports = Teacher; 