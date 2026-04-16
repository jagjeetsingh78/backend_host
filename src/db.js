const { Pool } = require('pg');
require('dotenv').config();

// Debug (remove in production if needed)
console.log("DB URL:", process.env.DATABASE_URL);

// Create pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // Required for Railway / cloud DBs
  ssl: {
    rejectUnauthorized: false,
  },

  // Increase timeout (important for cold starts)
  connectionTimeoutMillis: 15000,

  // Optional but recommended
  max: 5, // limit connections
  idleTimeoutMillis: 30000,
});

// 🔁 Retry connection (handles Railway cold start)
const connectWithRetry = async (retries = 5, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔌 Attempt ${i + 1} to connect to DB...`);
      const client = await pool.connect();
      console.log("✅ Database connected");
      client.release();
      return;
    } catch (err) {
      console.error(`❌ Attempt ${i + 1} failed:`, err.message);

      if (i === retries - 1) {
        console.error("🚨 All connection attempts failed");
        throw err;
      }

      console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

// 🚀 Initialize DB
const initDb = async () => {
  await connectWithRetry();
};

// 🧠 Optional: keep DB awake (prevents cold start)
setInterval(() => {
  pool.query('SELECT 1')
    .then(() => console.log("🟢 DB keep-alive ping"))
    .catch(err => console.error("🔴 Keep-alive failed:", err.message));
}, 5 * 60 * 1000); // every 5 minutes

module.exports = { pool, initDb };