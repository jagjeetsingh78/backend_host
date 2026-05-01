const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:vBdNrgRmiReRrKVBgUJBxXztbANKVGfJ@hopper.proxy.rlwy.net:46781/railway",
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const res = await pool.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name IN ('submissions', 'options', 'quiz_attempts', 'quizzes', 'quiz_questions', 'questions')
    `);
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();
