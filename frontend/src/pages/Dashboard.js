import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/dashboard.css";

function Dashboard() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [professors, setProfessors] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkDemonstrativ, setLinkDemonstrativ] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");

  const initialState = {
    title: "",
    description: "",
    professorId: "",
  };
  const [project, setProject] = useState(initialState);

  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:3001/api/profesori", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status === 'success') {
        setProfessors(response.data.data);
      }
    } catch (error) {
      console.error("Eroare la încărcarea profesorilor:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      setNotifications([]);
    } catch (error) {
      // Temporar dezactivat logging-ul erorilor pentru notificări
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !title || !description || !selectedProfessor) {
      alert("Toate câmpurile sunt obligatorii!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("professorId", selectedProfessor);
    if (linkDemonstrativ) {
      formData.append("link_demonstrativ", linkDemonstrativ);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3001/api/proiecte", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setShowUploadModal(false);
      setSelectedFile(null);
      setTitle("");
      setDescription("");
      setLinkDemonstrativ("");
      setSelectedProfessor("");
      alert("Proiect încărcat cu succes!");
    } catch (error) {
      console.error("Eroare la încărcarea proiectului:", error);
      alert("A apărut o eroare la încărcarea proiectului!");
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
  };

  const handleProjectsClick = () => {
    navigate("/projects");
  };

  const handleNotificationsClick = () => {
    navigate("/notifications");
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
          <button className="nav-button active">Acasă</button>
          <button className="nav-button" onClick={handleProjectsClick}>
            Vizualizează proiecte
          </button>
          <button
            className="nav-button"
            onClick={() => navigate("/projects_evaluated")}
          >
            Proiecte de evaluat
          </button>
         
          <button className="logout-button" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            Ieși din cont
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="upload-section" onClick={() => setShowUploadModal(true)}>
          <div className="folder-icon">📁</div>
          <h2>Încarcă proiect</h2>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Încarcă proiect</h2>
            <form className="upload-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Încarcă fișier proiect:</label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="file-input"
                    id="file-upload"
                    accept=".zip,.rar,.7z"
                  />
                  <label htmlFor="file-upload" className="file-upload-label">
                    {selectedFile ? selectedFile.name : "Alege fișier"}
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Titlu Proiect:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Introdu titlul proiectului"
                  required
                />
              </div>

              <div className="form-group">
                <label>Descriere Proiect:</label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrie proiectul"
                  required
                />
              </div>

              <div className="form-group">
                <label>Link demonstrativ:</label>
                <input
                  type="url"
                  value={linkDemonstrativ}
                  onChange={(e) => setLinkDemonstrativ(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label>Selectează Profesor Coordonator:</label>
                <select
                  value={selectedProfessor}
                  onChange={(e) => setSelectedProfessor(e.target.value)}
                  required
                >
                  <option value="">Alege un profesor</option>
                  {professors.map((prof) => (
                    <option key={prof.id_profesor} value={prof.id_profesor}>
                      {prof.nume_profesor} {prof.prenume_profesor} - {prof.specializare_profesor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-buttons">
                <button type="button" onClick={handleCloseModal}>
                  Anulează
                </button>
                <button type="submit">Trimite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
