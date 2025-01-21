import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    parola: "",
    rol: "student", // Default: student
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      console.log("Trimit date:", {
        email: formData.email,
        parola: formData.parola,
        rol: formData.rol
      });

      const response = await axios.post("http://localhost:3001/api/auth/login", {
        email: formData.email,
        parola: formData.parola,
        rol: formData.rol
      });

      console.log("Răspuns primit:", response.data);

      if (!response.data.data) {
        throw new Error("Format răspuns invalid");
      }

      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        
        // Salvează token-ul și datele utilizatorului
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        console.log('Token salvat:', token); // Pentru debugging
        
        // Redirecționare în funcție de rol
        if (user.rol === 'student') {
          navigate('/dashboard');
        } else if (user.rol === 'profesor') {
          navigate('/dashboard_prof');
        }
      }
    } catch (error) {
      console.error("Eroare completă:", error);
      setError(
        error.response?.data?.message || 
        error.message || 
        "Eroare la autentificare"
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

          <button type="submit" className="submit-button">
            Conectare
          </button>

          <div className="login-link">
            Nu ai cont? <Link to="/register">Înregistrează-te</Link>
          </div>
        </form>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default Login;
