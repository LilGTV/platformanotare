const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

// Înregistrare rute
app.use('/api', routes);

// Middleware pentru erori
app.use(errorHandler);

module.exports = app; 