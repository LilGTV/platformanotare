import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/dashboard.css";

function DashboardProf() {
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
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
      const response = await axios.get(`http://localhost:3001/api/proiecte?id_profesor=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Projects received:', response.data);
      setProjects(response.data.data || []);
      setError(null);
    } catch (error) {
      console.error("Eroare la încărcarea proiectelor:", error);
      setError("Nu s-au putut încărca proiectele. Vă rugăm încercați din nou.");
    } finally {
      setLoading(false);
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
      {/* Header */}
      <header className="dashboard-header">
        <div className="user-profile" onClick={handleProfileClick}>
          <div className="profile-icon">👤</div>
          <span>
            {user?.nume} {user?.prenume}
          </span>
        </div>
        <nav className="main-nav">
          <button className="logout-button" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            Ieși din cont
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <h2>Proiectele Mele Coordonate</h2>
        {loading ? (
          <div className="loading">Se încarcă proiectele...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
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
                      <strong>Student:</strong> {project.nume_elev}{" "}
                      {project.prenume_elev}
                    </p>
                    <p>
                      <strong>Notă Finală:</strong>{" "}
                      {project.nota_finala ? (
                        <span className="final-grade">{project.nota_finala}</span>
                      ) : (
                        "Nenotat încă"
                      )}
                    </p>
                    {project.link_demonstrativ && (
                      <p>
                        <strong>Link Demonstrativ:</strong>{" "}
                        <a 
                          href={project.link_demonstrativ} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="demo-link"
                        >
                          Vizualizează Demo
                        </a>
                      </p>
                    )}
                    {project.file_path && (
                      <button
                        className="download-btn"
                        onClick={() => handleDownload(project.id_proiect, project.file_path)}
                      >
                        <span style={{ color: 'white' }}>Descarcă Proiect</span>
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-projects">
                  Nu aveți proiecte asignate momentan.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardProf;
