const router = require('express').Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authenticateToken');

// GET ruta pentru obținerea datelor profilului
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // Folosim ID-ul din token pentru a găsi utilizatorul
    const userId = req.user.id;
    
    const result = await pool.query(
      'SELECT id, nume, prenume, email, parola FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length > 0) {
      res.json({
        success: true,
        user: result.rows[0]
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Utilizatorul nu a fost găsit'
      });
    }
  } catch (error) {
    console.error('Eroare la obținerea profilului:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la obținerea datelor profilului'
    });
  }
});

// PUT ruta pentru actualizarea profilului
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { nume, prenume, email, parola, userId } = req.body.updatedData;
    console.log(nume, prenume, email, parola, userId);
    const result = await pool.query(
      'UPDATE users SET nume = $1, prenume = $2, email = $3, parola = $4 WHERE id = $5 RETURNING *',
      [nume, prenume, email, parola, userId]
    );

    if (result.rows.length > 0) {
      res.json({
        success: true,
        user: result.rows[0],
        message: 'Profilul a fost actualizat cu succes'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Utilizatorul nu a fost găsit'
      });
    }
  } catch (error) {
    console.error('Eroare la actualizarea profilului:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la actualizarea profilului'
    });
  }
});

router.get('/all-users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result[0]); // Trimite utilizatorii către frontend
  } catch (error) {
    console.error('Eroare la obținerea utilizatorilor:', error);
    res.status(500).send('Eroare la obținerea datelor');
  }
});

module.exports = router;