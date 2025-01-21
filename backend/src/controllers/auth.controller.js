const AuthService = require('../services/auth.service');
const { AppError } = require('../utils/error-handler');

class AuthController {
  static async register(req, res, next) {
    try {
      console.log("Date primite pentru înregistrare:", req.body);
      
      const userData = await AuthService.register(req.body);
      
      console.log("Răspuns generat:", {
        ...userData,
        user: {
          ...userData.user,
          parola: undefined
        }
      });

      res.status(201).json({
        status: 'success',
        data: {
          token: userData.token,
          user: {
            id: userData.user.id,
            nume: userData.user.nume,
            prenume: userData.user.prenume,
            email: userData.user.email,
            rol: userData.user.rol,
            specializare: userData.user.specializare
          }
        }
      });
    } catch (error) {
      console.error("Eroare la înregistrare:", error);
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, parola, rol } = req.body;
      console.log("Date primite în controller:", { email, rol });

      let authResponse;
      if (rol === "student") {
        authResponse = await AuthService.loginStudent(email, parola);
      } else if (rol === "profesor") {
        authResponse = await AuthService.loginTeacher(email, parola);
      } else {
        throw new Error("Rol invalid");
      }

      console.log("Răspuns generat:", {
        ...authResponse,
        user: {
          ...authResponse.user,
          parola: undefined
        }
      });

      res.json({
        status: "success",
        data: {
          token: authResponse.token,
          user: {
            id: authResponse.user.id,
            nume: authResponse.user.nume,
            prenume: authResponse.user.prenume,
            email: authResponse.user.email,
            rol: rol
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyToken(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new AppError('Token necesar', 401);
      }

      const userData = await AuthService.verifyToken(token);
      res.json({
        status: 'success',
        data: userData
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;