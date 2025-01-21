import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/dashboard.css";

function EvaluatedProjects() {
  const [projects, setProjects] = useState([]);
  const [evaluations, setEvaluations] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjectsToEvaluate();
  }, []);

  const fetchProjectsToEvaluate = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log('ID Evaluator:', user.id);
      const response = await axios.get(
        `http://localhost:3001/api/proiecte/evaluator`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { id_evaluator: user.id }
        }
      );
      console.log('Răspuns de la server:', response.data);
      setProjects(response.data || []);
    } catch (error) {
      console.error("Eroare la încărcarea proiectelor:", error);
      console.error("Detalii eroare:", error.response?.data);
    }
  };

  const handleDownload = async (projectId, filePath) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3001/api/proiecte/${projectId}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filePath.split('/').pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Eroare la descărcarea proiectului:", error);
      alert("Nu s-a putut descărca proiectul. Vă rugăm încercați din nou.");
    }
  };

  const handleGradeChange = (projectId, value) => {
    setEvaluations(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        nota: value
      }
    }));
  };

  const handleSubmitEvaluation = async (projectId) => {
    try {
      const grade = evaluations[projectId]?.nota;
      
      if (!grade || grade < 1 || grade > 10) {
        alert("Vă rugăm să introduceți o notă validă între 1 și 10!");
        return;
      }

      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3001/api/proiecte/evaluare",
        {
          id_proiect: projectId,
          id_evaluator: user.id,
          nota: parseFloat(grade)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Actualizăm lista de proiecte după evaluare
      fetchProjectsToEvaluate();
      alert("Evaluare salvată cu succes!");
    } catch (error) {
      console.error("Eroare la salvarea evaluării:", error);
      alert("A apărut o eroare la salvarea evaluării!");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="user-profile" onClick={() => navigate("/profile")}>
          <div className="profile-icon">👤</div>
          <span>
            {user?.nume} {user?.prenume}
          </span>
        </div>
        <nav className="main-nav">
          <button className="nav-button" onClick={() => navigate("/dashboard")}>
            Acasă
          </button>
          <button className="nav-button" onClick={() => navigate("/projects")}>
            Vizualizează proiecte
          </button>
          <button className="nav-button active">Proiecte de evaluat</button>
          <button
            className="logout-button"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/");
            }}
          >
            <span className="logout-icon">🚪</span>
            Ieși din cont
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <h2>Proiecte de evaluat</h2>
        <div className="student-projects-container">
          <div className="student-projects-box">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.id_proiect} className="project-card">
                  <h3>{project.titlu_proiect}</h3>
                  <p>
                    <strong>Descriere:</strong> {project.descriere_proiect}
                  </p>
                  <p>
                    <strong>Student:</strong> {project.nume_elev} {project.prenume_elev}
                  </p>
                  <p>
                    <strong>Profesor Coordonator:</strong> {project.nume_profesor}{" "}
                    {project.prenume_profesor}
                  </p>
                  <p>
                    <strong>Link Demonstrativ:</strong>{" "}
                    <a 
                      href={project.link_demonstrativ} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        color: '#007bff',
                        textDecoration: 'underline',
                        marginLeft: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Vizualizează Demo
                    </a>
                  </p>
                  <div className="project-actions">
                    {project.file_path && (
                      <button
                        className="download-btn"
                        onClick={() => handleDownload(project.id_proiect)}
                      >
                        <span style={{ color: 'white' }}>Descarcă Proiect</span>
                      </button>
                    )}
                  </div>
                  <div className="evaluation-section">
                    <div className="grade-input">
                      <label>
                        <strong>Notă (1-10):</strong>
                        {project.nota_curenta > 0 && (
                          <div className="current-grade">
                            <p>Nota curentă: {project.nota_curenta}</p>
                            {project.data_evaluare && (
                              <p className="evaluation-date">
                                Evaluată la: {new Date(project.data_evaluare).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}
                        <input
                          type="number"
                          min="1"
                          max="10"
                          step="1"
                          value={evaluations[project.id_proiect]?.nota || ''}
                          onChange={(e) => handleGradeChange(project.id_proiect, e.target.value)}
                          className="grade-input-field"
                          disabled={!project.poate_modifica}
                        />
                      </label>
                    </div>
                    <button
                      className={`evaluate-btn ${!project.poate_modifica ? 'disabled' : ''}`}
                      onClick={() => handleSubmitEvaluation(project.id_proiect)}
                      disabled={!project.poate_modifica}
                    >
                      {project.nota_curenta > 0 ? 'Modifică Nota' : 'Evaluează'}
                    </button>
                    {!project.poate_modifica && (
                      <p className="evaluation-locked">
                        Perioada de evaluare s-a încheiat
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-projects">
                Nu ai evaluat niciun proiect până acum.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default EvaluatedProjects;
