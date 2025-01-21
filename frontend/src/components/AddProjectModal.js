import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/modal.css';

function AddProjectModal({ isOpen, onClose, onSubmit }) {
  const [project, setProject] = useState({
    titlu_proiect: '',
    descriere_proiect: '',
    id_profesor: '',
    fisier: null
  });
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Obține token-ul din localStorage
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Pentru debugging
        
        if (!token) {
          throw new Error('Nu sunteți autentificat');
        }

        const response = await axios.get('http://localhost:3001/api/profesori', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Răspuns profesori:', response.data); // Pentru debugging

        if (response.data.status === 'success') {
          setTeachers(response.data.data);
        } else {
          throw new Error('Eroare la încărcarea profesorilor');
        }
      } catch (error) {
        console.error('Eroare:', error);
        setError(error.response?.data?.message || 'Nu s-au putut încărca profesorii');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchTeachers();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(project);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Încarcă proiect</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Încarcă fișier proiect:</label>
            <input
              type="file"
              onChange={(e) => setProject({ ...project, fisier: e.target.files[0] })}
              required
            />
          </div>

          <div className="form-group">
            <label>Titlu Proiect:</label>
            <input
              type="text"
              value={project.titlu_proiect}
              onChange={(e) => setProject({ ...project, titlu_proiect: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Descriere Proiect:</label>
            <textarea
              value={project.descriere_proiect}
              onChange={(e) => setProject({ ...project, descriere_proiect: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Selectează Profesor Coordonator:</label>
            {loading ? (
              <p>Se încarcă profesorii...</p>
            ) : (
              <select
                value={project.id_profesor}
                onChange={(e) => setProject({ ...project, id_profesor: e.target.value })}
                required
              >
                <option value="">Alege un profesor</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id_profesor} value={teacher.id_profesor}>
                    {teacher.nume_profesor} {teacher.prenume_profesor} - {teacher.specializare_profesor}
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Anulează
            </button>
            <button type="submit" className="submit-btn">
              Trimite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProjectModal; 