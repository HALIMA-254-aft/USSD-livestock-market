// backend/src/ussd.js
const { Pool } = require('pg');

// Connect to PostgreSQL using Railway environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://livestock:livestock@localhost:5432/livestock_db',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

// Main USSD handler
async function handleUSSD(req, res) {
  const { sessionId, phoneNumber, text } = req.body;
  if (!sessionId || !phoneNumber || text === undefined) {
    return res.json({ status: 'error', message: 'Missing parameters' });
  }

  try {
    // Split text to know user input level
    const userResponse = text.split('*');
    let reply;

    if (text === '') {
      // Main menu
      reply = 'CON Welcome to Livestock Market\n1. Check Prices\n2. Sell Livestock';
    } else if (userResponse[0] === '1') {
      // Check prices
      reply = 'END Goat: KES 4,500\nSheep: KES 6,000';
    } else if (userResponse[0] === '2') {
      // Sell livestock
      const quantity = parseInt(userResponse[1] || '0', 10);
      if (!quantity || quantity <= 0) {
        reply = 'END Invalid quantity. Try again.';
      } else {
        // Save to DB
        await pool.query(
          'INSERT INTO aggregations (phone_number, animal_type, quantity) VALUES ($1, $2, $3)',
          [phoneNumber, 'goat', quantity]
        );
        reply = 'END Thank you. We will contact you shortly.';
      }
    } else {
      reply = 'END Invalid option.';
    }

    res.send(reply);
  } catch (err) {
    console.error('USSD ERROR:', err);
    res.send('END System error. Try again later.');
  }
}

module.exports = { handleUSSD };
