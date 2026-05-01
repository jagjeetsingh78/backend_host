const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:vBdNrgRmiReRrKVBgUJBxXztbANKVGfJ@hopper.proxy.rlwy.net:46781/railway",
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const res = await pool.query(
      "SELECT id FROM quizzes WHERE id = $1",
      ["1"] // string
    );
    console.log("SELECT string:", res.rows);
  } catch (err) {
    console.error("SELECT string error:", err.message);
  }
  
  try {
    const res = await pool.query(
      "SELECT id FROM quizzes WHERE id = $1",
      [1] // integer
    );
    console.log("SELECT int:", res.rows);
  } catch (err) {
    console.error("SELECT int error:", err.message);
  }

  pool.end();
}
run();
