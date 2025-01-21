import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import '../styles/evaluation.css';

const EVALUATION_CRITERIA = {
  functionalitate: 'Funcționalitate',
  calitate_cod: 'Calitatea Codului',
  interfata: 'Interfața Utilizator',
  inovatie: 'Inovație',
  prezentare: 'Prezentare'
};

function Evaluation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newEvaluation, setNewEvaluation] = useState({
    punctaj: {
      functionalitate: 5,
      calitate_cod: 5,
      interfata: 5,
      inovatie: 5,
      prezentare: 5
    },
    comentarii: ''
  });

  const fetchProjectAndEvaluations = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [projectRes, evaluationsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/proiecte/${id}`, { headers }),
        axios.get(`${process.env.REACT_APP_API_URL}/evaluari?id_proiect=${id}`, { headers })
      ]);

      setProject(projectRes.data);
      setEvaluations(evaluationsRes.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'A apărut o eroare');
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProjectAndEvaluations();
  }, [fetchProjectAndEvaluations]);

  const calculateAverageScores = useCallback(() => {
    if (!evaluations.length) return null;

    const totals = evaluations.reduce((accumulator, evaluation) => {
      Object.entries(evaluation.punctaj).forEach(([key, value]) => {
        accumulator[key] = (accumulator[key] || 0) + value;
      });
      return accumulator;
    }, {});

    return Object.entries(totals).reduce((accumulator, [key, value]) => {
      accumulator[key] = (value / evaluations.length).toFixed(2);
      return accumulator;
    }, {});
  }, [evaluations]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(
        `${process.env.REACT_APP_API_URL}/evaluari`,
        {
          id_proiect: id,
          punctaj: newEvaluation.punctaj,
          comentarii: newEvaluation.comentarii
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      await fetchProjectAndEvaluations();
      
      setNewEvaluation({
        punctaj: {
          functionalitate: 5,
          calitate_cod: 5,
          interfata: 5,
          inovatie: 5,
          prezentare: 5
        },
        comentarii: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Eroare la trimiterea evaluării');
    }
  };

  if (loading) return <div className="loading">Se încarcă...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!project) return <div className="error">Proiectul nu a fost găsit</div>;

  const averageScores = calculateAverageScores();

  return (
    <div className="evaluation-page">
      <header className="evaluation-header">
        <div className="header-content">
          <h1>{project?.titlu}</h1>
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            Înapoi la Dashboard
          </button>
        </div>
      </header>

      <div className="evaluation-content">
        <div className="project-details">
          <h2>Detalii Proiect</h2>
          <p>{project?.descriere}</p>
          <div className="project-links">
            <a href={project?.link_github} target="_blank" rel="noopener noreferrer" className="github-link">
              <i className="fab fa-github"></i> Vezi pe GitHub
            </a>
          </div>
        </div>

        {averageScores && (
          <div className="average-scores">
            <h2>Average Scores</h2>
            <div className="scores-grid">
              {Object.entries(averageScores).map(([criterion, score]) => (
                <div key={criterion} className="score-item">
                  <span className="criterion-label">{EVALUATION_CRITERIA[criterion]}</span>
                  <span className="score-value">{score}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="evaluation-form">
          <h2>Submit Your Evaluation</h2>
          <form onSubmit={handleSubmit}>
            <div className="criteria-grid">
              {Object.entries(EVALUATION_CRITERIA).map(([key, label]) => (
                <div key={key} className="criteria-item">
                  <label>{label}</label>
                  <div className="score-input">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={newEvaluation.punctaj[key]}
                      onChange={(e) => {
                        setNewEvaluation(prev => ({
                          ...prev,
                          punctaj: {
                            ...prev.punctaj,
                            [key]: parseInt(e.target.value)
                          }
                        }));
                      }}
                    />
                    <span className="score-display">
                      {newEvaluation.punctaj[key]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="comments-section">
              <label>Comments</label>
              <textarea
                value={newEvaluation.comentarii}
                onChange={(e) => setNewEvaluation(prev => ({
                  ...prev,
                  comentarii: e.target.value
                }))}
                placeholder="Enter your feedback here..."
                required
                minLength={10}
                maxLength={500}
              />
            </div>

            <button type="submit" className="submit-btn">
              Submit Evaluation
            </button>
          </form>
        </div>

        <div className="previous-evaluations">
          <h2>Previous Evaluations</h2>
          <div className="evaluations-grid">
            {evaluations.map((evaluation, index) => (
              <div key={evaluation.id_evaluare} className="evaluation-card">
                <div className="evaluation-header">
                  <span className="evaluator">Anonymous Evaluator #{index + 1}</span>
                  <span className="date">
                    {new Date(evaluation.data_evaluare).toLocaleDateString()}
                  </span>
                </div>
                <div className="scores-list">
                  {Object.entries(evaluation.punctaj).map(([criterion, score]) => (
                    <div key={criterion} className="score-row">
                      <span>{EVALUATION_CRITERIA[criterion]}</span>
                      <span className="score">{score}</span>
                    </div>
                  ))}
                </div>
                <div className="evaluation-comments">
                  <p>{evaluation.comentarii}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Evaluation.propTypes = {
  project: PropTypes.shape({
    id_proiect: PropTypes.number,
    titlu: PropTypes.string,
    descriere: PropTypes.string,
    link_github: PropTypes.string,
    tehnologii: PropTypes.arrayOf(PropTypes.string)
  }),
  evaluations: PropTypes.arrayOf(
    PropTypes.shape({
      id_evaluare: PropTypes.number,
      punctaj: PropTypes.object,
      comentarii: PropTypes.string,
      data_evaluare: PropTypes.string
    })
  )
};

export default Evaluation; 