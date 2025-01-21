import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/dashboard.css";

function ProjectsEvaluated() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3001/api/proiecte/evaluator?id_evaluator=${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log('Raw response:', response);
      console.log('Response data:', response.data);
      
      // Asigurăm-ne că avem un array de proiecte
      const projectsData = Array.isArray(response.data) ? response.data : [response.data];
      
      // Procesăm fiecare proiect pentru a ne asigura că toate câmpurile sunt prezente
      const processedProjects = projectsData.map(project => {
        console.log('Processing project:', project);
        return {
          id_proiect: project.id_proiect,
          titlu_proiect: project.titlu_proiect,
          descriere_proiect: project.descriere_proiect,
          nume_elev: project.nume_elev,
          prenume_elev: project.prenume_elev,
          nume_profesor: project.nume_profesor,
          prenume_profesor: project.prenume_profesor,
          nota_curenta: project.nota_curenta,
          data_evaluare: project.data_evaluare,
          poate_modifica: project.poate_modifica,
          file_path: project.file_path,
          link_demonstrativ: project.link_demonstrativ || "https://www.youtube.com/watch?v=I76wvt0aEE4" // Adăugăm link-ul demonstrativ direct aici
        };
      });
      
      console.log('Processed projects:', processedProjects);
      setProjects(processedProjects);
      setError(null);
    } catch (error) {
      console.error("Eroare la încărcarea proiectelor:", error);
      setError("Nu s-au putut încărca proiectele. Vă rugăm încercați din nou.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (projectId) => {
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
      link.setAttribute('download', 'project.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Eroare la descărcarea proiectului:", error);
      alert("Nu s-a putut descărca proiectul. Vă rugăm încercați din nou.");
    }
  };

  const handleSubmitEvaluation = async (projectId, nota) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3001/api/proiecte/evaluare",
        {
          id_proiect: projectId,
          id_evaluator: user.id,
          nota: parseFloat(nota)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      alert("Evaluare trimisă cu succes!");
      fetchProjects();
    } catch (error) {
      console.error("Eroare la trimiterea evaluării:", error);
      alert("Nu s-a putut trimite evaluarea. Vă rugăm încercați din nou.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="user-profile" onClick={handleProfileClick}>
          <div className="profile-icon">👤</div>
          <span>
            {user?.nume} {user?.prenume}
          </span>
        </div>
        <nav className="main-nav">
          <button className="nav-button" onClick={() => navigate("/dashboard")}>
            Acasă
          </button>
          <button className="nav-button active">Proiecte de evaluat</button>
          <button className="logout-button" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            Ieși din cont
          </button>
        </nav>
      </header>

      <main className="dashboard-main">
        <h2>Proiecte de Evaluat</h2>
        {loading ? (
          <div className="loading">Se încarcă proiectele...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="projects-container">
            {projects.length > 0 ? (
              projects.map(project => (
                <div key={project.id_proiect} className="project-card">
                  <h3>{project.titlu_proiect}</h3>
                  <div className="project-details">
                    <p><strong>Descriere:</strong> {project.descriere_proiect}</p>
                    <p>
                      <strong>Student:</strong> {project.nume_elev}{" "}
                      {project.prenume_elev}
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
                    {project.poate_modifica ? (
                      <div className="evaluation-form">
                        <label>
                          Notă (1-10):
                          <input
                            type="number"
                            min="1"
                            max="10"
                            step="0.1"
                            defaultValue={project.nota_curenta || ""}
                            onBlur={(e) => {
                              if (e.target.value) {
                                handleSubmitEvaluation(project.id_proiect, e.target.value);
                              }
                            }}
                          />
                        </label>
                      </div>
                    ) : (
                      <p>
                        <strong>Nota acordată:</strong> {project.nota_curenta}
                        {project.data_evaluare && (
                          <span className="evaluation-date">
                            {" "}
                            (Evaluat la: {new Date(project.data_evaluare).toLocaleDateString()})
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-projects">Nu aveți proiecte de evaluat momentan.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default ProjectsEvaluated; 