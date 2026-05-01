const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:vBdNrgRmiReRrKVBgUJBxXztbANKVGfJ@hopper.proxy.rlwy.net:46781/railway",
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const res = await pool.query(`ALTER TABLE quiz_attempts ADD COLUMN score INTEGER DEFAULT 0;`);
    console.log("Added score column to quiz_attempts table:", res);
  } catch (err) {
    console.error("Error altering table:", err.message);
  } finally {
    pool.end();
  }
}
run();
