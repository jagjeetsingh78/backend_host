const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:vBdNrgRmiReRrKVBgUJBxXztbANKVGfJ@hopper.proxy.rlwy.net:46781/railway",
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const res = await pool.query(`
      SELECT COUNT(*) AS score
       FROM submissions s
       JOIN options o ON s.selected_option_id = o.id
       WHERE s.attempt_id = 1 AND o.is_correct = true
    `);
    console.log("Without cast:", res.rows);
  } catch (err) {
    console.error("Error without cast:", err.message);
  }
  
  try {
    const res = await pool.query(`
      SELECT COUNT(*) AS score
       FROM submissions s
       JOIN options o ON s.selected_option_id::integer = o.id
       WHERE s.attempt_id = 1 AND o.is_correct = true
    `);
    console.log("With cast ::integer:", res.rows);
  } catch (err) {
    console.error("Error with ::integer:", err.message);
  }

  try {
    const res = await pool.query(`
      SELECT COUNT(*) AS score
       FROM submissions s
       JOIN options o ON s.selected_option_id = o.id::text
       WHERE s.attempt_id = 1 AND o.is_correct = true
    `);
    console.log("With cast ::text:", res.rows);
  } catch (err) {
    console.error("Error with ::text:", err.message);
  }

  pool.end();
}
run();
