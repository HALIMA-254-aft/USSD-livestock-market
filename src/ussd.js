const pool = require('./db');

async function handleUSSD({ sessionId, phoneNumber, text }) {
  const textArray = text ? text.split('*') : [];
  let response = '';

  try {
    // SAVE SESSION (THIS WAS FAILING BEFORE)
    await pool.query(
      `INSERT INTO ussd_sessions (phone_number, session_id, input_text, current_level)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (session_id)
       DO UPDATE SET input_text = $3, current_level = $4, updated_at = NOW()`,
      [phoneNumber, sessionId, text, textArray.length]
    );

    // MAIN MENU
    if (text === '') {
      response = `CON Welcome to Livestock Market
1. Check Prices
2. Sell Livestock`;
    }

    // CHECK PRICES
    else if (text === '1') {
      response = `END Goat: KES 4,500
Sheep: KES 6,000`;
    }

    // SELL LIVESTOCK
    else if (textArray[0] === '2') {
      if (textArray.length === 1) {
        response = `CON Enter number of goats:`;
      } else {
        const quantity = Number(textArray[1]);

        if (!quantity || quantity <= 0) {
          response = `END Invalid quantity`;
        } else {
          await pool.query(
            `INSERT INTO aggregations (phone_number, animal_type, quantity)
             VALUES ($1, $2, $3)`,
            [phoneNumber, 'goat', quantity]
          );

          response = `END Thank you. We will contact you shortly.`;
        }
      }
    }

    else {
      response = `END Invalid choice`;
    }

  } catch (err) {
    console.error('USSD ERROR:', err);
    response = `END System error. Try again later.`;
  }

  return response;
}

module.exports = { handleUSSD };
