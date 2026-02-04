const { Pool } = require('pg');

const pool = new Pool({
  user: 'livestock',
  host: 'localhost',
  database: 'livestock_db',
  password: 'livestock',
  port: 5432,
});

module.exports = pool;
