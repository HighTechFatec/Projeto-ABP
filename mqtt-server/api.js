const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'temp',
  password: '123',
  port: 5432,
});

app.listen(PORT);

app.get('/latest', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM temperature_data ORDER BY timestamp DESC LIMIT 1'
  );
  res.json(result.rows[0]);
});

app.get('/history', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM temperature_data ORDER BY timestamp DESC LIMIT 50'
  );
  res.json(result.rows);
});