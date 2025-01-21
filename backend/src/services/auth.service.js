const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Student, Teacher } = require('../models');
const { AppError } = require('../utils/error-handler');

class AuthService {
  static async register(userData) {
    const { email, parola, rol, nume, prenume, specializare } = userData;
    
    try {
      console.log('Începere înregistrare pentru:', { email, rol, nume, prenume });
      
      // Hash parola
      const hashedPassword = await bcrypt.hash(parola, 10);

      let user;
      if (rol === 'student') {
        user = await Student.create({
          nume_elev: nume,
          prenume_elev: prenume,
          email_elev: email,
          parola_elev: hashedPassword
        });
        console.log('Student creat:', user.id_elev);
      } else if (rol === 'profesor') {
        user = await Teacher.create({
          nume_profesor: nume,
          prenume_profesor: prenume,
          email_profesor: email,
          parola_profesor: hashedPassword,
          specializare_profesor: specializare
        });
        console.log('Profesor creat:', user.id_profesor);
      }

      // Generăm token-ul JWT
      const token = this.generateToken(
        rol === 'student' ? user.id_elev : user.id_profesor,
        rol
      );

      return {
        user: {
          id: rol === 'student' ? user.id_elev : user.id_profesor,
          nume: rol === 'student' ? user.nume_elev : user.nume_profesor,
          prenume: rol === 'student' ? user.prenume_elev : user.prenume_profesor,
          email: rol === 'student' ? user.email_elev : user.email_profesor,
          specializare: rol === 'profesor' ? user.specializare_profesor : undefined,
          rol
        },
        token
      };
    } catch (error) {
      console.error('Eroare la înregistrare�n service:', error);
      throw error;
    }
  }

  static async loginStudent(email, parola) {
    const student = await Student.findOne({
      where: { email_elev: email }
    });

    if (!student) {
      throw new AppError("Email sau parolă incorectă", 401);
    }

    const isValidPassword = await bcrypt.compare(parola, student.parola_elev);
    if (!isValidPassword) {
      throw new AppError("Email sau parolă incorectă", 401);
    }

    const token = this.generateToken(student.id_elev, "student");

    return {
      user: {
        id: student.id_elev,
        nume: student.nume_elev,
        prenume: student.prenume_elev,
        email: student.email_elev,
        rol: "student"
      },
      token
    };
  }

  static async loginTeacher(email, parola) {
    const teacher = await Teacher.findOne({
      where: { email_profesor: email }
    });

    if (!teacher) {
      throw new AppError('Email sau parolă incorectă', 401);
    }

    const isValidPassword = await bcrypt.compare(parola, teacher.parola_profesor);
    if (!isValidPassword) {
      throw new AppError('Email sau parolă incorectă', 401);
    }

    const token = this.generateToken(teacher.id_profesor, 'profesor');

    return {
      user: {
        id: teacher.id_profesor,
        nume: teacher.nume_profesor,
        prenume: teacher.prenume_profesor,
        email: teacher.email_profesor,
        specializare: teacher.specializare_profesor,
        rol: 'profesor'
      },
      token
    };
  }

  static generateToken(userId, role) {
    return jwt.sign(
      {
        id: userId,
        rol: role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }
}

module.exports = AuthService; 