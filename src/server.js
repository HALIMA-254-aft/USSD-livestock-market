// backend/src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const { handleUSSD } = require('./ussd'); // adjust path if needed

const app = express();

// Middleware to parse POST data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// USSD endpoint
app.post('/ussd', handleUSSD);

// Use the Railway provided port or default 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`USSD server running on port ${PORT}`);
});

