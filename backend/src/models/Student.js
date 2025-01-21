const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id_elev: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  nume_elev: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  prenume_elev: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email_elev: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  parola_elev: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'elev',
  timestamps: false
});

module.exports = Student; 