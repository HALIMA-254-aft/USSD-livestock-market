// db.js
const { Pool } = require('pg');
require('dotenv').config(); // load variables from .env

const pool = new Pool({
  user: process.env.DB_USER,       // e.g., 'livestock'
  host: process.env.DB_HOST,       // Railway DB host
  database: process.env.DB_NAME,   // e.g., 'livestock_db'
  password: process.env.DB_PASS,   // your DB password
  port: process.env.DB_PORT,       // usually 5432
});

pool.on('connect', () => {
  console.log('PostgreSQL connected');
});

module.exports = pool;
