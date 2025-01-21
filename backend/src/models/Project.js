const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id_proiect: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_proiect'
  },
  titlu_proiect: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'titlu_proiect'
  },
  descriere_proiect: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'descriere_proiect'
  },
  id_elev: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_elev'
  },
  id_profesor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_profesor'
  },
  nota_finala: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'nota_finala'
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'file_path'
  },
  link_demonstrativ: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'link_demonstrativ'
  }
}, {
  tableName: 'proiect',
  timestamps: false
});

// Definim relațiile
Project.associate = (models) => {
  Project.belongsTo(models.Student, {
    foreignKey: 'id_elev',
    as: 'student'
  });

  Project.belongsTo(models.Teacher, {
    foreignKey: 'id_profesor',
    as: 'teacher'
  });

  Project.hasMany(models.Evaluation, {
    foreignKey: 'id_proiect',
    as: 'evaluations'
  });
};

module.exports = Project; 