const { Pool } = require('pg');
require('dotenv').config();
console.log("DB URL:", process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const initDb = async () => {
  try {
    await pool.connect();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ DB connection error:", err);
    throw err;
  }
};

module.exports = { pool, initDb };