import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";

function Register() {
  const [formData, setFormData] = useState({
    nume: "",
    prenume: "",
    email: "",
    parola: "",
    rol: "student",
    specializare: "", // Adăugăm specializare în state
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Trimit date:", formData);
      
      const response = await axios.post("http://localhost:3001/api/auth/register", {
        nume: formData.nume,
        prenume: formData.prenume,
        email: formData.email,
        parola: formData.parola,
        rol: formData.rol,
        specializare: formData.specializare || undefined
      });

      console.log("Răspuns primit:", response.data);

      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        if (user.rol === "student") {
          navigate("/dashboard");
        } else if (user.rol === "profesor") {
          navigate("/dashboard_prof");
        }
      }
    } catch (error) {
      console.error("Eroare la înregistrare:", error);
      setError(
        error.response?.data?.message || 
        error.message || 
        "Eroare la înregistrare"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <div className="user-icon-large">👤</div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <input
              type="text"
              value={formData.nume}
              onChange={(e) =>
                setFormData({ ...formData, nume: e.target.value })
              }
              placeholder="Nume"
              required
            />
          </div>

          <div className="form-field">
            <input
              type="text"
              value={formData.prenume}
              onChange={(e) =>
                setFormData({ ...formData, prenume: e.target.value })
              }
              placeholder="Prenume"
              required
            />
          </div>

          <div className="form-field">
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Email"
              required
            />
          </div>

          <div className="form-field password-field">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.parola}
              onChange={(e) =>
                setFormData({ ...formData, parola: e.target.value })
              }
              placeholder="Parolă"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️"}
            </button>
          </div>

          <div className="role-selection">
            <label className="role-option">
              <input
                type="radio"
                name="rol"
                value="student"
                checked={formData.rol === "student"}
                onChange={(e) =>
                  setFormData({ ...formData, rol: e.target.value })
                }
              />
              <span>Student</span>
            </label>
            <label className="role-option">
              <input
                type="radio"
                name="rol"
                value="profesor"
                checked={formData.rol === "profesor"}
                onChange={(e) =>
                  setFormData({ ...formData, rol: e.target.value })
                }
              />
              <span>Profesor</span>
            </label>
          </div>

          {/* Afișare câmp Specializare doar pentru Profesor */}
          {formData.rol === "profesor" && (
            <div className="form-field">
              <input
                type="text"
                value={formData.specializare}
                onChange={(e) =>
                  setFormData({ ...formData, specializare: e.target.value })
                }
                placeholder="Specializare"
                required={formData.rol === "profesor"}
              />
            </div>
          )}

          <button type="submit" className="submit-button">
            Înregistrare
          </button>

          <div className="login-link">
            Ai deja cont? <Link to="/login">Conectează-te</Link>
          </div>
        </form>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default Register;
