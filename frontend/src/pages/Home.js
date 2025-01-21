import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';
import booksImage from '../assets/books.png';

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="left-section">
          <div className="logo-section">
            <div className="logo-placeholder">
              <img 
                src="https://upload.wikimedia.org/wikipedia/ro/a/a3/Logo_ASE.png" 
                alt="ASE Logo" 
                className="ase-logo"
              />
            </div>
            <div className="title-section">
              <h1>Platformă evaluare</h1>
              <h2>ACADEMIA DE STUDII ECONOMICE BUCUREȘTI</h2>
            </div>
          </div>
          <div className="books-illustration">
            <img 
              src={booksImage} 
              alt="Books Stack" 
              className="books-image"
            />
          </div>
        </div>
        <div className="right-section">
          <div className="auth-box">
            <div className="user-icon">
              👤
            </div>
            <Link to="/register" className="auth-button">
              Înregistrare
            </Link>
            <Link to="/login" className="auth-button">
              Conectare
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 