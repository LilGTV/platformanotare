const Joi = require('joi');

const schemas = {
  evaluation: Joi.object({
    id_proiect: Joi.number().required(),
    punctaj: Joi.number().min(1).max(10).required(),
    comentarii: Joi.string().min(10).max(500).required()
  }),

  project: Joi.object({
    titlu: Joi.string().min(3).max(100).required(),
    descriere: Joi.string().min(10).max(1000).required(),
    link_github: Joi.string().uri().required(),
    tehnologii: Joi.string().required()
  }),

  register: Joi.object({
    email: Joi.string().email().required(),
    parola: Joi.string().min(6).required(),
    rol: Joi.string().valid('elev', 'profesor', 'student').required(),
    nume: Joi.string().min(2).max(50).required(),
    prenume: Joi.string().min(2).max(50).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    parola: Joi.string().required(),
    rol: Joi.string().valid('elev', 'profesor', 'student').required()
  })
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schemas[schema].validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Eroare de validare',
        details: error.details.map(err => ({
          message: err.message,
          field: err.path.join('.')
        }))
      });
    }
    next();
  };
};

module.exports = {
  validate,
  schemas
};
