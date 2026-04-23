const express = require('express');
const router = express.Router();
const { pool } = require('../db');

const getquiz = async (req, res) => {
    const chapterId = req.params.chapterId || req.query.chapterId;

    if (!chapterId) {
        return res.status(400).json({ message: "Chapter ID is required" });
    }

    const chapterIdNumber = parseInt(chapterId, 10);
    if (Number.isNaN(chapterIdNumber)) {
        return res.status(400).json({ message: "Chapter ID must be a number" });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM quizzes WHERE chapter_id = $1',
            [chapterIdNumber]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};




const getstart = async (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId);

    if (!quizId) {
      return res.status(400).json({ message: "Invalid Quiz ID" });
    }

    console.log("Fetching quiz:", quizId);

    const result = await pool.query(
      `SELECT 
        qz.id AS quiz_id,
        qz.time_limit,
        q.id AS question_id,
        q.text AS question_text,
        q.image_url,
        o.id AS option_id,
        o.text AS option_text
      FROM quiz_questions qq
      JOIN quizzes qz ON qq.quiz_id = qz.id
      JOIN questions q ON qq.question_id = q.id
      JOIN options o ON o.question_id = q.id
      WHERE qq.quiz_id = $1
      ORDER BY qq.order_index`,
      [quizId]
    );

    console.log("Rows fetched:", result.rows.length);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Quiz not found or no questions" });
    }

    const totalTime = result.rows[0].time_limit || 0;

    const questionsMap = {};

    result.rows.forEach(row => {
      if (!questionsMap[row.question_id]) {
        questionsMap[row.question_id] = {
          questionId: row.question_id,
          questionText: row.question_text || "",
          imageUrl: row.image_url || null,
          options: []
        };
      }

      questionsMap[row.question_id].options.push({
        optionId: row.option_id,
        text: row.option_text || ""
      });
    });

    res.json({
      quizId,
      totalTime,
      totalQuestions: Object.keys(questionsMap).length,
      questions: Object.values(questionsMap)
    });

  } catch (err) {
    console.error("🔥 ERROR:", err.stack);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
};
router.get('/chapter/:chapterId', getquiz);
router.get('/start/:quizId', getstart);


module.exports = router;