const express = require('express');
const router = express.Router();
const { pool } = require('../db');

const getCategories = async (req, res) => {
  try {
    const categories = await pool.query(
      'SELECT * FROM categories ORDER BY id ASC',
    );

    res.json({
      success: true,
      user: req.dbUser,
      data: categories.rows,
    });

  } catch (err) {
    console.error("DB ERROR 👉", err); // 👈 ADD THIS
    res.status(500).json({ message: err.message });
  }
};




router.get('/', getCategories);

module.exports = router;  