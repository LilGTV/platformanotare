import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/dashboard.css";

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentProjects();
  }, []);

  const fetchStudentProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3001/api/proiecte?id_student=${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log('Proiecte primite:', response.data);
      setProjects(response.data.data || []);
    } catch (error) {
      console.error("Eroare la încărcarea proiectelor:", error);
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
          <button className="nav-button active">Vizualizează proiecte</button>
          <button
            className="nav-button"
            onClick={() => navigate("/projects_evaluated")}
          >
            Proiecte de evaluat
          </button>
          <button
            className="logout-button"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/");
            }}
          ><span className="logout-icon">🚪</span>
            Ieși din cont
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <h2>Proiecte</h2>
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
                    <strong>Profesor Coordonator:</strong>{" "}
                    {project.nume_profesor} {project.prenume_profesor}
                  </p>
                  {project.link_demonstrativ && (
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
                  )}
                  <p>
                    <strong>Notă Finală:</strong>{" "}
                    {project.nota_finala ? (
                      <span className="final-grade">{project.nota_finala}</span>
                    ) : (
                      "Nenotat încă"
                    )}
                  </p>
                  <div className="project-actions">
                    {project.file_path && (
                      <button
                        className="download-btn"
                        onClick={() => handleDownload(project.id_proiect, project.file_path)}
                      >
                        <span style={{ color: 'white' }}>Descarcă Proiect</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-projects">
                Nu ai proiecte încărcate.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectManagement;
