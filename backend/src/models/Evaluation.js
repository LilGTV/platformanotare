const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Evaluation = sequelize.define('Evaluation', {
  id_evaluare: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_evaluare'
  },
  id_proiect: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_proiect'
  },
  id_evaluator: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_evaluator'
  },
  nota: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
    field: 'nota'
  },
  data_evaluare: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'data_evaluare'
  }
}, {
  tableName: 'evaluare',
  timestamps: false
});

module.exports = Evaluation; 