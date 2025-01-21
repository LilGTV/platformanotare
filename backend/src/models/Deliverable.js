const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Deliverable = sequelize.define('Deliverable', {
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
    type: DataTypes.TEXT
  },
  dataLimitaEvaluare: {
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
  }
});

module.exports = Deliverable; 