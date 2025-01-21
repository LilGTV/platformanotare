const Joi = require('joi');

const schemas = {
  register: Joi.object({
    nume: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.min': 'Numele trebuie să aibă cel puțin 2 caractere',
        'string.max': 'Numele nu poate depăși 50 de caractere',
        'any.required': 'Numele este obligatoriu'
      }),
    prenume: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.min': 'Prenumele trebuie să aibă cel puțin 2 caractere',
        'string.max': 'Prenumele nu poate depăși 50 de caractere',
        'any.required': 'Prenumele este obligatoriu'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Adresa de email nu este validă',
        'any.required': 'Email-ul este obligatoriu'
      }),
    parola: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'Parola trebuie să aibă cel puțin 6 caractere',
        'any.required': 'Parola este obligatorie'
      }),
    rol: Joi.string()
      .valid('student', 'profesor')
      .required()
      .messages({
        'any.only': 'Rolul trebuie să fie student sau profesor',
        'any.required': 'Rolul este obligatoriu'
      }),
    specializare: Joi.string()
      .when('rol', {
        is: 'profesor',
        then: Joi.string().required(),
        otherwise: Joi.string().optional()
      })
      .messages({
        'any.required': 'Specializarea este obligatorie pentru profesori'
      })
  }),

  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Adresa de email nu este validă',
        'any.required': 'Email-ul este obligatoriu'
      }),
    parola: Joi.string()
      .required()
      .messages({
        'any.required': 'Parola este obligatorie'
      }),
    rol: Joi.string()
      .valid('student', 'profesor')
      .required()
      .messages({
        'any.only': 'Rolul trebuie să fie student sau profesor',
        'any.required': 'Rolul este obligatoriu'
      })
  }),

  project: Joi.object({
    titlu_proiect: Joi.string()
      .required()
      .min(3)
      .max(50)
      .messages({
        'string.empty': 'Titlul proiectului este obligatoriu',
        'string.min': 'Titlul trebuie să aibă cel puțin 3 caractere',
        'string.max': 'Titlul nu poate depăși 50 de caractere'
      }),
    descriere_proiect: Joi.string()
      .required()
      .min(10)
      .max(50)
      .messages({
        'string.empty': 'Descrierea proiectului este obligatorie',
        'string.min': 'Descrierea trebuie să aibă cel puțin 10 caractere',
        'string.max': 'Descrierea nu poate depăși 50 de caractere'
      }),
    id_profesor: Joi.number()
      .required()
      .messages({
        'any.required': 'ID-ul profesorului este obligatoriu'
      })
  }),

  evaluation: Joi.object({
    id_proiect: Joi.number()
      .required()
      .messages({
        'any.required': 'ID-ul proiectului este obligatoriu'
      }),
    nota: Joi.number()
      .required()
      .min(1)
      .max(10)
      .messages({
        'number.base': 'Nota trebuie să fie un număr',
        'number.min': 'Nota minimă este 1',
        'number.max': 'Nota maximă este 10',
        'any.required': 'Nota este obligatorie'
      })
  })
};

const validate = (schema) => {
  return (req, res, next) => {
    console.log('Validare pentru schema:', schema);
    console.log('Date primite:', req.body);
    
    const validationSchema = schemas[schema];
    if (!validationSchema) {
      return res.status(500).json({
        status: 'error',
        message: `Schema de validare "${schema}" nu există`
      });
    }

    const { error } = validationSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      return res.status(400).json({
        status: 'error',
        message: 'Date invalide',
        errors
      });
    }

    next();
  };
};

module.exports = {
  validate,
  schemas
}; 