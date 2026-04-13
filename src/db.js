require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS exams (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      icon VARCHAR(50),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

module.exports = {
  sql,
  initDb,
};
