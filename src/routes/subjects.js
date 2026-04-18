const express = require('express');
const router = express.Router();
const { pool } = require('../db'); // ✅ use pool

const getSubjects = async (req, res) => {
  try {
    const response = await pool.query(
      `SELECT id, name, icon_url, total_chapters, total_questions 
       FROM subjects
       ORDER BY id ASC`
    );

    res.status(200).json({
      success: true,
      data: response.rows, // ✅ important (pg returns rows)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

router.get('/', getSubjects);

module.exports = router;