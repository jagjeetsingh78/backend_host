const express = require('express');
const router = express.Router();
const { sql } = require('../db');

// GET all exams
router.get('/', async (req, res, next) => {
  try {
    const exams = await sql`SELECT * FROM exams ORDER BY id`; 
    res.json(exams);
  } catch (err) {
    next(err);
  }
});

// POST create an exam
router.post('/', async (req, res, next) => {
  try {
    const { name, slug, icon, description } = req.body;
    const [exam] = await sql`
      INSERT INTO exams (name, slug, icon, description)
      VALUES (${name}, ${slug}, ${icon}, ${description})
      RETURNING *
    `;
    res.status(201).json(exam);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
