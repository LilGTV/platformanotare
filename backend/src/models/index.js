const Project = require('./Project');
const Student = require('./Student');
const Teacher = require('./Teacher');
const Evaluation = require('./Evaluation');

// Definim relațiile între modele
Project.belongsTo(Student, {
  foreignKey: 'id_elev',
  as: 'student'
});

Project.belongsTo(Teacher, {
  foreignKey: 'id_profesor',
  as: 'teacher'
});

Student.hasMany(Project, {
  foreignKey: 'id_elev',
  as: 'projects'
});

Teacher.hasMany(Project, {
  foreignKey: 'id_profesor',
  as: 'projects'
});

Project.hasMany(Evaluation, {
  foreignKey: 'id_proiect',
  as: 'evaluations'
});

Evaluation.belongsTo(Project, {
  foreignKey: 'id_proiect',
  as: 'project'
});

Evaluation.belongsTo(Student, {
  foreignKey: 'id_evaluator',
  as: 'evaluator'
});

module.exports = {
  Project,
  Student,
  Teacher,
  Evaluation
}; 