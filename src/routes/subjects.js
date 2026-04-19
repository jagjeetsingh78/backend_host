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
      data: response.rows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getchapters = async (req, res) => {
  try {
    const { subjectId } = req.params;

    // 🔥 Step 1: check subject exists
    const subjectCheck = await pool.query(
      `SELECT id FROM subjects WHERE id = $1`,
      [subjectId]
    );

    if (subjectCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    // 🔥 Step 2: get chapters
    const response = await pool.query(
      `SELECT * FROM chapters 
       WHERE subject_id = $1 
       ORDER BY chapter_order ASC`,
      [subjectId]
    );

    return res.status(200).json({
      success: true,
      data: response.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

router.get('/', getSubjects);
router.get('/:subjectId/chapters', getchapters);

module.exports = router;