const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Jury = sequelize.define('Jury', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  deliverableId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  membruId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dataSelectie: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Jury; 