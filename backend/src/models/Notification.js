const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id_notificare: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tip: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_destinatar: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mesaj: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  citit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  id_proiect: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'notificari',
  timestamps: true
});

module.exports = Notification; 