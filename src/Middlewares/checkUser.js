const { pool } = require('../db');

const checkUser = async (req, res, next) => {
  const uid = req.user.uid;
  console.log("Firebase UID:", uid);

  const user = await pool.query(
    'SELECT * FROM users WHERE firebase_uid = $1',
    [uid]
  );

  if (user.rows.length === 0) {
    return res.status(403).json({ message: "User not found" });
  }

  req.dbUser = user.rows[0];
  next();
};

module.exports = checkUser;