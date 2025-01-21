const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nume: DataTypes.STRING,
  prenume: DataTypes.STRING,
  email: DataTypes.STRING,
  parola: DataTypes.STRING
}, {
  tableName: 'elev',
  timestamps: false
});

const Teacher = sequelize.define('Teacher', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nume: DataTypes.STRING,
  prenume: DataTypes.STRING,
  email: DataTypes.STRING,
  parola: DataTypes.STRING
}, {
  tableName: 'profesor',
  timestamps: false
});

module.exports = { Student, Teacher }; 