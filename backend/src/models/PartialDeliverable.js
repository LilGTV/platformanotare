const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PartialDeliverable = sequelize.define('PartialDeliverable', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titlu: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descriere: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dataLimita: {
    type: DataTypes.DATE,
    allowNull: false
  },
  videoUrl: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true
    }
  },
  proiectUrl: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true
    }
  },
  status: {
    type: DataTypes.ENUM('in_asteptare', 'in_evaluare', 'evaluat'),
    defaultValue: 'in_asteptare'
  }
});

module.exports = PartialDeliverable; 